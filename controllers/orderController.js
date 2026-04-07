import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";


// Global variables
const currency = 'usd';
const deliveryCharge = 10;

// Gateway Integration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const store_id = process.env.SSLCOMMERZ_STORE_ID;
// const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
// const is_live = false; // true when live

// 1. Placing order using COD
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Cash on Delivery",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while placing order" });
    }
};

// 2. Placing order using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while creating Stripe session" });
    }
};

// 3. Verifying Stripe Payment
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Payment Verified and Order Placed Successfully" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Failed. Order Cancelled" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while verifying payment" });
    }
};

// 4. SSL Commerz Payment Gateway Integration
// const placeOrderSSL = async (req, res) => {
//     try {
//         const { userId, items, amount, address, name, email, phone } = req.body;
//         const { origin } = req.headers;

//         const orderData = {
//             userId,
//             items,
//             address,
//             amount,
//             paymentMethod: "SSLCommerz",
//             payment: false,
//             date: Date.now()
//         };
//         const newOrder = new orderModel(orderData);
//         await newOrder.save();

//         const data = {
//             total_amount: parseFloat(amount),
//             currency: 'BDT',
//             tran_id: newOrder._id.toString(),
//             // ফিক্স: userId কুয়েরি প্যারামিটারে পাঠানো হয়েছে ভেরিফিকেশনের জন্য
//             success_url: `${origin}/verify-ssl?success=true&orderId=${newOrder._id}&userId=${userId}`,
//             fail_url: `${origin}/verify-ssl?success=false&orderId=${newOrder._id}`,
//             cancel_url: `${origin}/verify-ssl?success=false&orderId=${newOrder._id}`,
//             ipn_url: `${process.env.BACKEND_URL}/api/order/status`,
//             shipping_method: 'Courier',
//             product_name: 'Ecommerce Items',
//             product_category: 'General',
//             product_profile: 'general',
//             cus_name: name || address.firstName,
//             cus_email: email || address.email,
//             cus_add1: address.street || 'Dhaka',
//             cus_city: address.city || 'Dhaka',
//             cus_state: address.state || 'Dhaka',
//             cus_postcode: address.zipcode || '1000',
//             cus_country: 'Bangladesh',
//             cus_phone: phone || address.phone,
//             ship_name: name || address.firstName,
//             ship_add1: address.street,
//             ship_city: address.city,
//             ship_state: address.state,
//             ship_postcode: address.zipcode,
//             ship_country: 'Bangladesh',
//         };

//         const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
//         const apiResponse = await sslcz.init(data);
       

//         if (apiResponse?.GatewayPageURL) {
//             res.json({ success: true, url: apiResponse.GatewayPageURL });
//         } else {
//             res.json({ success: false, message: "SSLCommerz session failed" });
//         }

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error while creating SSL session" });
//     }
// };

// 5. Verifying SSL Payment
// const verifySSL = async (req, res) => {
//     try {
        
//         const { success, orderId, userId } = req.body;

//         if (success === "true" && orderId) {
           
//             const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true });
            
//             if (updatedOrder) {
              
//                 await userModel.findByIdAndUpdate(userId || updatedOrder.userId, { cartData: {} });
                
             
//                 return res.json({ success: true, message: "Payment Successful & Order Updated" });
//             }
//         } 
        
       
//         if (orderId) {
//             await orderModel.findByIdAndDelete(orderId);
//         }
//         res.json({ success: false, message: "Payment Failed or Order Not Found" });

//     } catch (error) {
//         console.log("SSL Verify Error:", error);
//         res.json({ success: false, message: "Verification Error" });
//     }
// };

// 6. Admin & User Functions
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while fetching all orders" });
    }
};

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while fetching user orders" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while updating order status" });
    }
};

export { verifyStripe, placeOrder, placeOrderStripe,   allOrders, userOrders, updateOrderStatus };