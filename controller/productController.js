const Product = require("../model/productModel");
const AppError = require("../errorHandler/AppError");
const ProductType = require("../model/productTypeModel");
const LikeProduct = require("../model/likeProduct");

/**
 * gets all products
 * @param req
 * @param res status,statusCode,data
 * @param next err
 */
//ama product type ma khali name avvu joi a    "productType": { "medicine"},  ammm
exports.getAllProduct = async (req, res, next) => {
  try {
    const temp = await Product.find()
      .populate({ path: "productType", select: "-_id -__v" })
      .populate({
        path: "likes",
        select: "user_id -_id -product_id",
      })
      .populate({
        path: "likescount",
      })
      .populate({
        path: "dislikes",
        select: "user_id -_id -product_id",
      })
      .populate({
        path: "dislikescount",
      })
      .populate({
        path: "comments",
        select: "user_id comment -_id -product_id",
      })
      .lean();

    console.log(temp);

    const recentProduct = temp.map((product) => {
      const {
        likes,
        dislikes,
        createdAt,
        updatedAt,
        __v,
        productType,
        comments,
        expireDate,
        likescount,
        dislikescount,
        ...rest
      } = product;
      return {
        ...rest,
        productType: productType.productType,
        expireDate,
        likescount,
        likes: likes.map(({ user_id }) => user_id),
        dislikescount,
        dislikes: dislikes.map(({ user_id }) => user_id),
        comments,
      };
    });

    console.log(recentProduct);

    if (temp.length == 0) {
      return res.status(200).json({
        status: "Success",
        message: "No data found",
      });
    }

    res.status(200).json({
      status: "Success",
      statusCode: 200,
      recentProduct,
    });
  } catch (err) {
    return next(new AppError("No product exists", 500));
  }
};

/**
 *  creates a new product
 * @param req  productName, expireDate, price, productType, description
 * @param res status,statusCode,data
 * @param next err
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { productName, expireDate, price, productType, description } =
      req.body;
    const existProducttype = await Product.find({
      productName: req.body.productName,
    });
    console.log("existing", existProducttype);
    if (existProducttype.length > 0) {
      return next(new AppError("Already product is exist", 403));
    }

    console.log(productName, expireDate, price, productType, description);
    let producttypeID;
    const producttype = await ProductType.findOne({ _id: productType });

    if (!producttype) {
      return next(new AppError("ProductType does not exists", 404));
    } else {
      producttypeID = producttype._id;
    }

    const product = await Product.create({
      productType: producttypeID,
      productName,
      expireDate,
      price,
      description,
      photo: req.file.filename,
    });

    if (product) {
      res.status(201).json({
        status: "Success",
        statusCode: 201,
        data: product,
      });
    }
  } catch (err) {
    if (err.name == "ValidationError")
      return next(new AppError(err.message, 404));
    return next(new AppError("Your request is not fullfiled.", 404));
  }
};

/**
 * updates a product by its ID
 * @param  req expiryDate,price,productName,productType,photo
 * @param  res statusCode,status,updated product
 * @param  next err
 * @returns updated product
 */
exports.updateProduct = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return next(new AppError("body is not exist", 400));
    }
    if (req.params.id.length != 24) {
      next(new AppError("Product is not a found", 404));
    }
    const product = await Product.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: product,
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};
/**
 *find Product By its Id
 * @param  req  id
 * @param  res  product
 * @param  next err
 */
exports.findProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    const length = await LikeProduct.findById(product._id).count();
    console.log(length);
    product.numOfLikes = length;
    res.status(200).json({
      status: "Success",
      statusCode: 200,
      data: product,
    });
  } catch (err) {
    return next(new AppError("Invalid Prduct Id", 404));
  }
};

/**
 * deletes a product
 * @param req product id
 * @param res status,statusCod
 * @param next err
 */

exports.deleteProduct = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError("Id is not exist", 404));
    }
    const productExists = await Product.findById(req.params.id);
    if (!productExists)
      return next(new AppError("Product does not exists", 400));

    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      statusCode: 204,
      data: null,
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

/**
 * gets all products
 * @param  req
 * @param  res status,statusCode,data
 * @param  next err
 */
exports.mostRecentProduct = async (req, res, next) => {
  try {
    const recentValue = await Product.find().sort({ timestamp: -1 }).limit(1);
    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: recentValue,
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

/**
 * returns a product type by its type id
 * @param  req product,type,id
 * @param  res status,statusCode,data
 * @param  next err
 */
exports.getProductByProductType = async (req, res, next) => {
  try {
    const product = await Product.find({ productType: req.params.id });
    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: product,
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};
