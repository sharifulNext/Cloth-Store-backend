import userModel from '../models/userModel.js';

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const {userId, itemId, size } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        if(cartData[itemId]){
             if(cartData[itemId][size]){
                cartData[itemId][size] += 1
             }
             else{
                 cartData[itemId][size] = 1
             }

        } else{
             cartData[itemId] = {};
             cartData[itemId][size] = 1;
        }
        await userModel.findByIdAndUpdate(userId, {cartData: cartData});
        res.json({ success: true, message: 'Product added to cart successfully' });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

}

// update products in user cart
const updateCart = async (req, res) => {
    try {
        const {userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, {cartData: cartData});
        res.json({ success: true, message: 'Cart updated successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

}

//  get user cart data
const getUserCart = async (req, res) => {
    try {
        const {userId} = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        res.json({ success: true,cartData });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

}



export {addToCart, updateCart, getUserCart};


