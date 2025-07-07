require("dotenv").config();
const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const { connect } = require('./services/rabbitmq');
const { initEventListeners } = require('./services/eventManager');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connect().then(() => initEventListeners());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => res.send("User Service"));
module.exports = app;
