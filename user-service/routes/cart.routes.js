const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Protected routes - require user authentication

router.post("/",cartController.addToCart);
router.get("/:userId", cartController.getCart);
router.delete("/:productId", cartController.removeFromCart);
router.put("/:productId", cartController.updateCartItem);

module.exports = router;