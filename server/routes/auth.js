 
var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;