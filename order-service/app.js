require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/order.routes");
const { connect } = require('./services/rabbitmq');
const {
  consumePaymentProcessed,
  publishOrderCreated,
} = require('./services/eventManager');

const app = express();

// Middleware
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Order Service MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

connect().then(() => {
  consumePaymentProcessed((data) => {
    console.log('✅ Handling payment processed logic...', data);
    // TODO: update order status, notify user, etc.
  });
});

app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;