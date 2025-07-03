require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");

const orderRoutes = require("./routes/order.routes");

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api/orders", orderRoutes);

module.exports = app;
