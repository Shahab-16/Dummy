require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", adminRoutes);

module.exports = app;
