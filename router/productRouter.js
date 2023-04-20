const express = require("express");
const producutController = require("../controller/productController");
const likeController = require("../controller/likeProductController");
const commentController = require("../controller/commentController");
const authController = require("../controller/authController");
const upload = require("../multer");
const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    upload.uploadUserPhoto,
    producutController.createProduct
  );
router
  .route("/getAllProduct")
  .get(authController.protect, producutController.getAllProduct);

router
  .route("/mostRecentProduct")
  .get(authController.protect, producutController.mostRecentProduct);
router.route("/mostLikedProduct").get(likeController.MostLikedProduct);
router
  .route("/comment/:id")
  .post(authController.protect, commentController.comment);
router
  .route("/:id")
  .get(authController.protect, producutController.findProductById);
router
  .route("/updateProduct/:id")
  .patch(authController.protect, producutController.updateProduct);
router
  .route("/deletProduct/:id")
  .delete(authController.protect, producutController.deleteProduct);

router.route("/like/:id").post(authController.protect, likeController.like);
// router
//   .route("/dislike/:id")
//   .post(authController.protect, likeController.dislike);

router
  .route("/getProductByProductType/:id")
  .get(authController.protect, producutController.getProductByProductType);
module.exports = router;
