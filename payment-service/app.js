require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const paymentRoutes = require("./routes/payment.routes");
const {connect}=require('./services/rabbitmq');

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Payment Service MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));
// Middleware
app.use(express.json());

connect();

// Routes
app.use("/api/payments", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;