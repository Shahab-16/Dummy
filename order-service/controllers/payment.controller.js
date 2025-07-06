const Payment = require("../models/payment.model");
const Order = require("../models/order.model");
const eventService = require("../services/eventService");

// Mock payment processing
const processPayment = async (order, paymentMethod) => {
  // In real implementation, integrate with payment gateway
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      });
    }, 2000);
  });
};

exports.createPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body;
    
    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Verify ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    // Check payment status
    if (order.paymentStatus !== "pending") {
      return res.status(400).json({ message: "Payment already processed" });
    }
    
    // Process payment
    const paymentResult = await processPayment(order, paymentMethod);
    
    if (!paymentResult.success) {
      order.paymentStatus = "failed";
      await order.save();
      
      return res.status(400).json({ message: "Payment failed" });
    }
    
    // Create payment record
    const payment = new Payment({
      order: orderId,
      amount: order.totalAmount,
      paymentMethod,
      transactionId: paymentResult.transactionId,
      status: "completed"
    });
    
    await payment.save();
    
    // Update order
    order.paymentStatus = "completed";
    await order.save();
    
    // Publish PAYMENT_PROCESSED event
    await eventService.publishPaymentProcessed({
      orderId: order._id,
      amount: order.totalAmount,
      userId: order.userId
    });
    
    res.status(201).json({
      message: "Payment completed successfully",
      payment,
      order
    });
  } catch (error) {
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};