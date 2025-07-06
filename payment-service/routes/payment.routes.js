const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Process payment for an order
router.post(
  "/order/:orderId",
  authMiddleware.protectUser,
  paymentController.createPayment
);

// Get payment details
router.get(
  "/order/:orderId",
  authMiddleware.protectUser,
  paymentController.getPaymentDetails
);

module.exports = router;