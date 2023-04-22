const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    comment: {
      type: String,
      required: [true, "A comment must have a message"],
      trim: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;
