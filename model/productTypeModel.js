const mongoose = require("mongoose");

const productTypeSchema = mongoose.Schema({
  productType: {
    type: String,
    required: [true, "productType allready exist.."],
    unique: true,
    trim: true,
  },
});

const ProductType = mongoose.model("ProductType", productTypeSchema);
module.exports = ProductType;
