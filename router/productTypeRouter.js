const express = require("express");
const productTypeController = require("../controller/productTypeController");
const authController = require("../controller/authController");
const router = express.Router();

router
  .route("/getAllProductType")
  .get(authController.protect, productTypeController.getAllProductType);
router
  .route("/createProductType")
  .post(authController.protect, productTypeController.createProductType);

router
  .route("/:id")
  .delete(authController.protect, productTypeController.deleteProductType);
router
  .route("/:id")
  .patch(authController.protect, productTypeController.updateProductType);
module.exports = router;
