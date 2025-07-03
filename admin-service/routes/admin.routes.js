const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.post("/login", adminController.login);
router.get("/info", adminController.getAdminInfo);
router.get("/logout", adminController.logout);

module.exports = router;
