const mongoose = require("mongoose");

const disLikeProductSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    disLikeCount: {
      type: Number,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const DisLikeProduct = mongoose.model("DisLikeProduct", disLikeProductSchema);

module.exports = DisLikeProduct;
