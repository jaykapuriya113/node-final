const Product = require("../model/productModel");
const AppError = require("../errorHandler/AppError");
const Comment = require("../model/commentmodel");
/**
 *
 * @param  req user.id
 * @param  res comment
 * @param  next err
 */
exports.comment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError("Product does not exists", 403));
    }

    const addComment = new Comment({
      user_id: req.user.id,
      product_id: product._id,
      comment: req.body.comment,
    });
    const created = await addComment.save();

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
