const express = require("express");
const authController = require("../controllers/auth.controller.js")


const router = express.Router();

router.post("/user/register", authController.registerUser);
// router.post("/userlogin", authController.loginUser);





module.exports = router;