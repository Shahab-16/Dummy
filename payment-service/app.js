require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const paymentRoutes = require("./routes/payment.routes");

app.use(cors());
app.use(express.json());

// Stripe webhook requires raw body
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use("/api/payment", paymentRoutes);

module.exports = app;
