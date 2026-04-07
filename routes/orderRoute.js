import express from "express";
import {placeOrder, placeOrderStripe, allOrders, userOrders, updateOrderStatus}  from '../controllers/orderController.js';
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import { verifyStripe } from "../controllers/orderController.js";



const orderRouter = express.Router();

// Admin Routes
orderRouter.post('/status', adminAuth, updateOrderStatus);
orderRouter.post('/list', adminAuth, allOrders);

// Payment Routes
orderRouter.post('/stripe',authUser, placeOrderStripe);
orderRouter.post('/place',authUser, placeOrder);
// orderRouter.post('/razorpay',authUser, placeOrderRazorpay);
// orderRouter.post('/ssl', authUser, placeOrderSSL);


// User Features
orderRouter.post('/user-orders',authUser, userOrders);


// Verify Payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);

// orderRouter.post('/verifySSL', verifySSL);


export default orderRouter;
