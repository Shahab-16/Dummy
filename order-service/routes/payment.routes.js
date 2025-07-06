const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/order/:orderId",
  authMiddleware.protectUser,
  paymentController.createPayment
);

module.exports = router;