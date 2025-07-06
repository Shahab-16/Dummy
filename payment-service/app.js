require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const paymentRoutes = require("./routes/payment.routes");
const eventService = require("./services/eventService");

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Payment Service MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));
// Middleware
app.use(express.json());

// Initialize RabbitMQ
eventService.init().catch(err => {
  console.error("Failed to initialize EventService:", err);
});

setTimeout(async () => {
  try {
    await eventService.consumeOrderCreated(async (order) => {
      console.log(`Received ORDER_CREATED for order: ${order._id}`);
      // In a real system, you might send a payment link email here
    });
    console.log("Order created consumer started");
  } catch (err) {
    console.error("Failed to start consumer:", err);
  }
}, 5000); // Wait 5 seconds for initialization


// Setup order created consumer
eventService.consumeOrderCreated(async (order) => {
  console.log(`Received ORDER_CREATED for order: ${order._id}`);
  // In a real system, you might send a payment link email here
});

// Routes
app.use("/api/payments", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;