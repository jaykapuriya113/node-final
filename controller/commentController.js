const Product = require("../model/productModel");
const AppError = require("../errorHandler/AppError");
const Comment = require("../model/commentmodel");

exports.comment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("productType", {
      name: 1,
    });
    if (!product) {
      return next(new AppError("Product does not exists", 403));
    }

    const addComment = new Comment({
      user_id: req.user.id,
      product_id: product.id,
      comment: req.body.comment,
    });
    const created = await addComment.save();

    // product.comments.push(created._id);

    // await product.save();

    if (created) {
      res.json({
        status: "Comment Added Successfully",
        statusCode: 200,
        addComment,
      });
    }
  } catch (error) {
    return next(new AppError("Something went wrong", 500));
  }
};
