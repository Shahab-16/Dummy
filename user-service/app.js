require("dotenv").config();
const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const { connect } = require('./services/rabbitmq');
const { initEventListeners } = require('./services/eventManager');
const cors = require('cors');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

connect().then(() => initEventListeners());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => res.send("User Service"));
module.exports = app;
