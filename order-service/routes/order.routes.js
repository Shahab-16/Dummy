const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// User routes
router.post("/", authMiddleware.protectUser, orderController.createOrder);
router.get("/:id", authMiddleware.protectUser, orderController.getOrderById);
router.get("/", authMiddleware.protectUser, orderController.getUserOrders);
router.put("/:id/cancel", authMiddleware.protectUser, orderController.cancelOrder);

// Payment webhook (no auth - called internally by payment service)
router.post("/payment-webhook", orderController.updatePaymentStatus);

module.exports = router;