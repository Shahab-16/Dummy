const Order = require("../models/order.model");

exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentIntentId, address } = req.body;

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      paymentIntentId,
      address,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.status(200).json({ message: "Order status updated", order: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
