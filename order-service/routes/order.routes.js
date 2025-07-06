const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// User routes
router.post("/", authMiddleware.protectUser, orderController.createOrder);
router.get("/:id", authMiddleware.protectUser, orderController.getOrderById);
router.get("/user/orders", authMiddleware.protectUser, orderController.getUserOrders);
router.put("/:id/cancel", authMiddleware.protectUser, orderController.cancelOrder);

// Admin routes
router.get("/", authMiddleware.protectAdmin, orderController.getAllOrders);
router.put("/:id/status", authMiddleware.protectAdmin, orderController.updateOrderStatus);

module.exports = router;