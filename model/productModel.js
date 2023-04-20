const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
    },
    productName: {
      type: String,
      required: [true, "A product must have a name"],
      unique: true,
      trim: true,
      maxlength: [30, "A product must have less or equal then 40 characters"],
    },
    expireDate: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A product must have a description"],
    },

    timestamp: {
      type: Date,
      default: Date.now(),
    },
    photo: {
      type: String,
      required: [true, "A product must have a image"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
productSchema.virtual("likes", {
  ref: "LikeProduct",
  localField: "_id",
  foreignField: "product_id",
});
productSchema.virtual("likescount", {
  ref: "LikeProduct",
  localField: "_id",
  foreignField: "product_id",
  count: true,
});

productSchema.virtual("dislikes", {
  ref: "DisLikeProduct",
  localField: "_id",
  foreignField: "product_id",
});
productSchema.virtual("dislikescount", {
  ref: "DisLikeProduct",
  localField: "_id",
  foreignField: "product_id",
  count: true,
});

productSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "product_id",
});
productSchema.virtual("commentscount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "product_id",
  count: true,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
