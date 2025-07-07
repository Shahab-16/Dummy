const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Place an order (Axios + RabbitMQ)
router.post("/", authMiddleware.protectUser, orderController.placeOrder);

// Get all orders for a user
router.get("/", authMiddleware.protectUser, orderController.getUserOrders);

// Get single order details
router.get("/:orderId", authMiddleware.protectUser, orderController.getOrderById);

// Cancel an order (optional)
router.delete("/:orderId", authMiddleware.protectUser, orderController.cancelOrder);

module.exports = router;
