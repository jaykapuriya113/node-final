const mongoose = require("mongoose");

const likeProductSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    likesCount: {
      type: Number,
    },
  },

  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const LikeProduct = mongoose.model("LikeProduct", likeProductSchema);

module.exports = LikeProduct;
