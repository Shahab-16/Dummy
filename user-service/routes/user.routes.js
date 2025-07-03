const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/user/:id", userController.getUser);
router.get("/logout", userController.getLogout);
router.post("/googlesignin", userController.postGoogleSignin);
router.post("/likeproduct", userController.likeProduct);

module.exports = router;
