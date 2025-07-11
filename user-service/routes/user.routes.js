const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authmiddleware = require("../middleware/auth.middleware");

// Authentication routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/google-auth", userController.googleAuth);
router.get("/me", authmiddleware.protectUser, userController.getUserProfile);
router.get("/logout", userController.logout);

module.exports = router;