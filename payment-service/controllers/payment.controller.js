const Payment = require("../models/payment.model");
const eventService = require("../services/eventService");
const axios = require("axios");

// Mock payment processing
const processPayment = async (order, paymentMethod) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 85% success rate
      const success = Math.random() < 0.85;
      resolve({
        success,
        transactionId: success ? `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}` : null
      });
    }, 1500);
  });
};

exports.createPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod = "credit_card" } = req.body;
    
    // Get order details from order service
    const orderResponse = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}`,
      { 
        headers: { 
          Authorization: req.headers.authorization 
        } 
      }
    );
    
    const order = orderResponse.data;
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Verify ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    // Check if payment already exists
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({ 
        message: "Payment already exists for this order",
        payment: existingPayment
      });
    }
    
    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      userId: order.userId,
      amount: order.totalAmount,
      paymentMethod,
      status: "pending"
    });
    
    await payment.save();
    
    // Process payment
    const paymentResult = await processPayment(order, paymentMethod);
    
    // Update payment status
    payment.status = paymentResult.success ? "completed" : "failed";
    payment.transactionId = paymentResult.transactionId;
    await payment.save();
    
    // Publish PAYMENT_PROCESSED event
    await eventService.publishPaymentProcessed({
      orderId: order._id,
      status: payment.status
    });
    
    res.status(201).json({
      message: paymentResult.success 
        ? "Payment completed successfully" 
        : "Payment failed",
      payment
    });
  } catch (error) {
    console.error("Payment error:", error);
    
    if (error.response) {
      // Propagate error from order service
      return res.status(error.response.status).json(error.response.data);
    }
    
    res.status(500).json({ 
      message: "Payment processing failed", 
      error: error.message 
    });
  }
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ orderId });
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Verify ownership
    if (payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};