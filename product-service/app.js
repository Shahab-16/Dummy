require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const rabbitmq = require("./services/rabbitmq");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");

connectDB();

app.use(express.json());
app.use(cookieParser());

rabbitmq.connect();

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
