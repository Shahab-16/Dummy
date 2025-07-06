const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const cartRoutes = require("./cart.routes");

// Authentication routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/me", userController.getUserProfile);

// Cart routes
router.use("/cart", cartRoutes);

module.exports = router;