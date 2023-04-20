const productType = require("../model/productTypeModel");
const AppError = require("../errorHandler/AppError");
const Product = require("../model/productModel");

/**
 * Create product
 * @param  req ProductType
 * @param  res Status,statuCode,productType
 * @param  next err
 */
exports.createProductType = async (req, res, next) => {
  try {
    if (!req.body.productType || typeof req.body.productType != "string") {
      return next(new AppError("ProductType type is not found", 404));
    }

    const existProducttype = await productType.find({
      productType: req.body.productType,
    });
    if (existProducttype.length > 0) {
      return next(new AppError("Already productype is exist", 403));
    }
    const pt = await productType.create(req.body);
    res.status(201).json({
      status: "success",
      statusCode: 201,
      data: pt,
    });
  } catch (err) {
    return next(new AppError("Somthing went wrong", 404));
  }
};

/**
 *get all product
 * @param  req
 * @param  res status,statuCode,productType
 * @param  next err
 */
exports.getAllProductType = async (req, res, next) => {
  try {
    const pt = await productType.find();
    if (pt.length == 0) {
      return res.status(404).json({
        status: "success",
        message: "No data found",
      });
    }
    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: [...pt],
    });
  } catch (err) {
    return next(new AppError("Data does not exist", 404));
  }
};
/**
 * deletes product type by id
 * @param  req id
 * @param  res
 * @param  next err
 */
exports.deleteProductType = async (req, res, next) => {
  try {
    const product_Type = await productType.findById(req.params.id);
    if (!product_Type) return next(new AppError("Product Type Does not exist"));

    const products = await Product.find({ productType: product_Type._id });
    console.log(products.length);
    if (products.length > 0) {
      return next(
        new AppError("Product Type can't be deleted because it is in use")
      );
    }
    const product = await productType.findByIdAndDelete(product_Type._id);
    res.status(201).json({
      status: "success",
      statusCode: 201,
      data: null,
      message: "Product Type is deleted successfully",
    });
  } catch (err) {
    return next(new AppError(err, 404));
  }
};

/**
 * update a product type
 * @param req id
 * @param res updated,product,type
 * @param next error
 */
exports.updateProductType = async (req, res, next) => {
  try {
    const pt = await productType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pt) {
      return next(new AppError("No product fot the id", 401));
    }
    res.status(200).json({
      status: "Success",
      statusCode: 200,
      data: pt,
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 404));
  }
};
