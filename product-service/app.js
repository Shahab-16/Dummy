require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const rabbitmq = require("./services/rabbitmq");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");

connectDB();
rabbitmq.connect();

app.use(cookieParser());

// ✅ Don't use express.json() globally — only for non-file routes
app.use("/categories", express.json(), categoryRoutes);

// ✅ This will receive multipart/form-data; multer will handle it
app.use("/products", productRoutes);

module.exports = app;
