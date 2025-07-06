require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/order.routes");
const eventService = require("./services/eventService");

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Order Service MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Initialize RabbitMQ
eventService.init();

// Setup payment status consumer
eventService.consumePaymentProcessed(async (message) => {
  if (message.event === "PAYMENT_PROCESSED") {
    // Call webhook to update order status
    try {
      await axios.post(
        `${process.env.ORDER_SERVICE_URL}/api/orders/payment-webhook`,
        {
          orderId: message.data.orderId,
          status: message.data.status
        }
      );
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  }
});

// Routes
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;