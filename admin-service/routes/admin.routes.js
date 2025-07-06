const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.post("/login", adminController.login);
router.get("/info", adminController.getAdminInfo);
router.get("/logout", adminController.logout);

// Product management routes
router.post("/products", adminController.addProduct);
router.delete("/products/:id", adminController.removeProduct);
router.get("/products", adminController.listAllProducts);

module.exports = router;