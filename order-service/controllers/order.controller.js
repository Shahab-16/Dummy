const Order = require("../models/order.model");
const eventService = require("../services/eventService");
const mongoose = require("mongoose");

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
      paymentRedirect: `/api/orders/${order._id}/payment`
    });
  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
};

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

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
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

// Admin-only endpoints
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Publish ORDER_UPDATED event
    await eventService.publishOrderUpdated({
      orderId: order._id,
      status: order.status
    });

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};