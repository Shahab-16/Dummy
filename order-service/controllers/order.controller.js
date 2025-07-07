const Order = require("../models/order.model");
const eventService = require("../services/eventManager");
const axios = require("axios");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    // Create order
    const order = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentStatus: "pending"
    });

    await order.save();

    // Publish ORDER_CREATED event
    await eventService.publishOrderCreated({
      orderId: order._id,
      userId: order.userId,
      items: order.items,
      totalAmount: order.totalAmount
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
      paymentInitiation: {
        method: "POST",
        url: `${process.env.PAYMENT_SERVICE_URL}/api/payments/order/${order._id}`
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Verify ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Verify ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    // Only pending orders can be cancelled
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }
    
    order.status = "cancelled";
    await order.save();
    
    // Publish ORDER_UPDATED event
    await eventService.publishOrderUpdated({
      orderId: order._id,
      status: order.status
    });
    
    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Webhook for payment service to update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    // Validate status
    if (!["completed", "failed"].includes(status)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Update payment status
    order.paymentStatus = status;
    
    // If payment failed, cancel order
    if (status === "failed") {
      order.status = "cancelled";
    }
    
    await order.save();
    
    // Publish ORDER_UPDATED event
    await eventService.publishOrderUpdated({
      orderId: order._id,
      status: order.status,
      paymentStatus: order.paymentStatus
    });
    
    res.json({ message: "Payment status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};