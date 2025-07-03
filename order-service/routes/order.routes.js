const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.post("/", orderController.createOrder);
router.get("/user/:userId", orderController.getUserOrders);
router.put("/status/:orderId", orderController.updateOrderStatus);

module.exports = router;
