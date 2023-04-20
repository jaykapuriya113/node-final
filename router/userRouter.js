const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
// const authController=require("../controller/authController")

router
      .route("/")
      .get(userController.getAllUsers)
      .post(userController.createUsers);

router
      .route("/login")
      .post(userController.loginUser)

module.exports = router;
