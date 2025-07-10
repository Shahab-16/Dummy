require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/admin.routes");
const rabbitmq = require("./services/rabbitmq");

const app = express();

app.use(express.json());
app.use(cookieParser());

rabbitmq.connect();

app.use("/admin", adminRoutes);

module.exports = app;
