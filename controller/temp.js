const { randomUUID } = require("crypto");
const { runInContext } = require("vm");

exports.getAllProduct = async (req, res, next) => {
  try {
    // const temp = await Product.find()
    //   .populate({ path: "productType", select: "-_id -__v" })
    //   .populate({
    //     path: "likes",
    //     select: "user_id -_id -product_id",
    //   })
    //   .populate({
    //     path: "likescount",
    //   })
    //   .populate({
    //     path: "dislikes",
    //     select: "user_id -_id -product_id",
    //   })
    //   .populate({
    //     path: "dislikescount",
    //   })
    //   .populate({
    //     path: "comments",
    //     select: "user_id comment -_id -product_id",
    //   })
    //   .lean();

    // const recentProduct = temp.map((product) => {
    //   const {
    //     likes,
    //     dislikes,
    //     createdAt,
    //     updatedAt,
    //     __v,
    //     productType,
    //     comments,
    //     expireDate,
    //     likescount,
    //     dislikescount,
    //     ...rest
    //   } = product;
    //   return {
    //     ...rest,
    //     productType: productType.productType,
    //     expireDate,
    //     likescount,
    //     likes: likes.map(({ user_id }) => user_id),
    //     dislikescount,
    //     dislikes: dislikes.map(({ user_id }) => user_id),
    //     comments,
    //   };
    // });

    const query = [
      {
        $lookup: {
          from: "likeproducts",
          localField: "_id",
          foreignField: "product_id",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likes.user_id",
          foreignField: "_id",
          as: "userlikes",
        },
      },
      {
        $project: {
          // total_likes: { $size: "$likes" },
          // likes: 0,
          "userlikes.email": 0,
          "userlikes.password": 0,
          "userlikes._id": 0,
          "userlikes.__v": 0,
        },
      },
      {
        $addFields: {
          total_likes: { $size: { $ifNull: ["$likes", []] } },
        },
      },
      //////////////////////////////////////
      {
        $lookup: {
          from: "dislikeproducts",
          localField: "_id",
          foreignField: "product_id",
          as: "dislikes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "dislikes.user_id",
          foreignField: "_id",
          as: "userdislikes",
        },
      },
      {
        $project: {
          "userdislikes.email": 0,
          "userdislikes.password": 0,
          "userdislikes._id": 0,
          "userdislikes.__v": 0,
        },
      },
      {
        $addFields: {
          total_dislikes: { $size: { $ifNull: ["$dislikes", []] } },
        },
      },

      // {
      //   $lookup: {
      //     from: "comments",
      //     localField: "_id",
      //     foreignField: "product_id",
      //     as: "comment",
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "comment.user_id",
      //     foreignField: "_id",
      //     as: "userComment",
      //   },
      // },
      // {
      //   $project: {
      //     "userComment.email": 0,
      //     "userComment.password": 0,
      //     "userComment._id": 0,
      //     "userComment.__v": 0,
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "comments",
      //     localField: "_id",
      //     foreignField: "product_id",
      //     as: "comments",
      //   },
      // },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "product_id",
          as: "comment",
        },
      },
      // {
      //   $unwind: "$comment",
      // },
      {
        $lookup: {
          from: "users",
          localField: "comment.user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          "user.email": 0,
          "user.password": 0,
          "user._id": 0,
          "user.__v": 0,
        },
      },
    ];

    const temp = await Product.aggregate(query);
    console.log(temp);

    const allProducts = temp.map((product) => {
      const {
        comment,
        userComment,
        total_likes,
        total_dislikes,
        userlikes,
        userdislikes,
        dislikes,
        likes,
        createdAt,
        updatedAt,
        __v,
        comments,
        ...rest
      } = product;

      const userCommentArray = userComment.map(({ name }, index) => ({
        name,
        comment: comment[index].comment,
      }));

      // const userCommentArray = [];
      // userComment.forEach((user, index) => {
      //   comment.forEach((c) => {
      //     if (c.user_id.toString() === user._id.toString()) {
      //       userCommentArray.push({
      //         name: user.name,
      //         comment: c.comment,
      //       });
      //     }
      //   });
      // });

      return {
        ...rest,
        total_likes,
        userlikes: userlikes.map(({ name }) => name),
        total_dislikes,
        userdislikes: userdislikes.map(({ name }) => name),
        userComment: userCommentArray,
      };
    });

    res.status(200).json({
      status: "Success",
      statusCode: 200,
      temp,
    });
  } catch (err) {
    return next(new AppError("No product exists", 500));
  }
};

// ==========================================runInContext
// const Product = require("../model/productModel");
// const AppError = require("../errorHandler/AppError");
// const ProductType = require("../model/productTypeModel");
// const LikeProduct = require("../model/likeProduct");
// const DisLikeProduct = require("../model/dislikeproduct");
// const Comment = require("../model/commentmodel");
// /**
//  * gets all products
//  * @param req
//  * @param res status,statusCode,data
//  * @param next err
//  */

// exports.getAllProduct = async (req, res, next) => {
//   try {
//     // const temp = await Product.find()
//     //   .populate({ path: "productType", select: "-_id -__v" })
//     //   .populate({
//     //     path: "likes",
//     //     select: "user_id -_id -product_id",
//     //   })
//     //   .populate({
//     //     path: "likescount",
//     //   })
//     //   .populate({
//     //     path: "dislikes",
//     //     select: "user_id -_id -product_id",
//     //   })
//     //   .populate({
//     //     path: "dislikescount",
//     //   })
//     //   .populate({
//     //     path: "comments",
//     //     select: "user_id comment -_id -product_id",
//     //   })
//     //   .lean();

//     // const recentProduct = temp.map((product) => {
//     //   const {
//     //     likes,
//     //     dislikes,
//     //     createdAt,
//     //     updatedAt,
//     //     __v,
//     //     productType,
//     //     comments,
//     //     expireDate,
//     //     likescount,
//     //     dislikescount,
//     //     ...rest
//     //   } = product;
//     //   return {
//     //     ...rest,
//     //     productType: productType.productType,
//     //     expireDate,
//     //     likescount,
//     //     likes: likes.map(({ user_id }) => user_id),
//     //     dislikescount,
//     //     dislikes: dislikes.map(({ user_id }) => user_id),
//     //     comments,
//     //   };
//     // });
//     const query = [
//       {
//         $lookup: {
//           from: "likeproducts",
//           localField: "_id",
//           foreignField: "product_id",
//           as: "likes",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "likes.user_id",
//           foreignField: "_id",
//           as: "userlikes",
//         },
//       },
//       {
//         $project: {
//           "userlikes.email": 0,
//           "userlikes.password": 0,
//           "userlikes._id": 0,
//           "userlikes.__v": 0,
//         },
//       },
//       {
//         $addFields: {
//           total_likes: { $size: { $ifNull: ["$likes", []] } },
//         },
//       },
//       //////////////////////////////////////
//       {
//         $lookup: {
//           from: "dislikeproducts",
//           localField: "_id",
//           foreignField: "product_id",
//           as: "dislikes",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "dislikes.user_id",
//           foreignField: "_id",
//           as: "userdislikes",
//         },
//       },
//       {
//         $project: {
//           "userdislikes.email": 0,
//           "userdislikes.password": 0,
//           "userdislikes._id": 0,
//           "userdislikes.__v": 0,
//         },
//       },
//       {
//         $addFields: {
//           total_dislikes: { $size: { $ifNull: ["$dislikes", []] } },
//         },
//       },
//       //////////////////////////////////////////////////////////////
//       {
//         $lookup: {
//           from: "comments",
//           localField: "_id",
//           foreignField: "product_id",
//           as: "comment",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "comment.user_id",
//           foreignField: "_id",
//           as: "userComment",
//         },
//       },
//       {
//         $project: {
//           "userComment.email": 0,
//           "userComment.password": 0,
//           "userComment._id": 0,
//           "userComment.__v": 0,
//         },
//       },
//     ];

//     const temp = await Product.aggregate(query);

//     const allProducts = temp.map((product) => {
//       const {
//         comment,
//         userComment,
//         total_likes,
//         total_dislikes,
//         userlikes,
//         userdislikes,
//         dislikes,
//         likes,
//         createdAt,
//         updatedAt,
//         __v,
//         comments,
//         ...rest
//       } = product;

//       const userCommentArray = userComment.map(({ name }, index) => ({
//         name,
//         comment: comment[index].comment,
//       }));

//       return {
//         ...rest,
//         total_likes,
//         userlikes: userlikes.map(({ name }) => name),
//         total_dislikes,
//         userdislikes: userdislikes.map(({ name }) => name),
//         userComment: userCommentArray,
//       };
//     });

//     res.status(200).json({
//       status: "Success",
//       statusCode: 200,
//       allProducts,
//     });
//   } catch (err) {
//     return next(new AppError("No product exists", 500));
//   }
// };

// /**
//  *  creates a new product
//  * @param req  productName, expireDate, price, productType, description
//  * @param res status,statusCode,data
//  * @param next err
//  */
// exports.createProduct = async (req, res, next) => {
//   try {
//     const { productName, expireDate, price, productType, description } =
//       req.body;
//     const existProducttype = await Product.find({
//       productName: req.body.productName,
//     });
//     if (existProducttype.length > 0) {
//       return next(new AppError("Already product is exist", 403));
//     }
//     let producttypeID;
//     const producttype = await ProductType.findOne({ _id: productType });

//     if (!producttype) {
//       return next(new AppError("ProductType does not exists", 404));
//     } else {
//       producttypeID = producttype._id;
//     }

//     const product = await Product.create({
//       productType: producttypeID,
//       productName,
//       expireDate,
//       price,
//       description,
//       photo: req.file.filename,
//     });

//     if (product) {
//       res.status(201).json({
//         status: "Success",
//         statusCode: 201,
//         data: product,
//       });
//     }
//   } catch (err) {
//     if (err.name == "ValidationError")
//       return next(new AppError(err.message, 404));
//     return next(new AppError("Your request is not fullfiled.", 404));
//   }
// };

// /**
//  * updates a product by its ID
//  * @param  req expiryDate,price,productName,productType,photo
//  * @param  res statusCode,status,updated product
//  * @param  next err
//  */
// exports.updateProduct = async (req, res, next) => {
//   try {
//     if (Object.keys(req.body).length === 0) {
//       return next(new AppError("body is not exist", 400));
//     }
//     if (req.params.id.length != 24) {
//       next(new AppError("Product is not a found", 404));
//     }
//     const product = await Product.findOneAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: "success",
//       statusCode: 200,
//       data: product,
//     });
//   } catch (err) {
//     return next(new AppError("Something went wrong", 500));
//   }
// };
// /**
//  *find Product By its Id
//  * @param  req  id
//  * @param  res  product
//  * @param  next err
//  */
// exports.findProductById = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     const length = await LikeProduct.findById(product._id).count();
//     product.numOfLikes = length;
//     res.status(200).json({
//       status: "Success",
//       statusCode: 200,
//       data: product,
//     });
//   } catch (err) {
//     return next(new AppError("Invalid Prduct Id", 404));
//   }
// };

// /**
//  * deletes a product
//  * @param req product id
//  * @param res status,statusCod
//  * @param next err
//  */

// exports.deleteProduct = async (req, res, next) => {
//   try {
//     if (!req.params.id) {
//       return next(new AppError("Id is not exist", 404));
//     }
//     const productExists = await Product.findById(req.params.id);
//     if (!productExists)
//       return next(new AppError("Product does not exists", 400));
//     Promise.all([
//       LikeProduct.deleteMany({ product_id: req.params.id }),
//       DisLikeProduct.deleteMany({ product_id: req.params.id }),
//       Comment.deleteMany({ product_id: req.params.id }),
//     ]).then(() => {
//       console.log("all deleted");
//     });
//     const product = await Product.findByIdAndDelete(req.params.id);
//     res.status(200).json({
//       status: "success",
//       statusCode: 204,
//       data: null,
//     });
//   } catch (err) {
//     return next(new AppError("Something went wrong", 500));
//   }
// };

// /**
//  * gets all products
//  * @param  req
//  * @param  res status,statusCode,data
//  * @param  next err
//  */
// exports.mostRecentProduct = async (req, res, next) => {
//   try {
//     const recentValue = await Product.find().sort({ timestamp: -1 }).limit(1);
//     res.status(200).json({
//       status: "success",
//       statusCode: 200,
//       data: recentValue,
//     });
//   } catch (err) {
//     return next(new AppError("Something went wrong", 500));
//   }
// };

// /**
//  * returns a product type by its type id
//  * @param  req product,type,id
//  * @param  res status,statusCode,data
//  * @param  next err
//  */
// exports.getProductByProductType = async (req, res, next) => {
//   try {
//     const product = await Product.find({ productType: req.params.id });
//     res.status(200).json({
//       status: "success",
//       statusCode: 200,
//       data: product,
//     });
//   } catch (err) {
//     return next(new AppError("Something went wrong", 500));
//   }
// };

// /*

//       // {
//       //   $lookup: {
//       //     from: "comments",
//       //     localField: "_id",
//       //     foreignField: "product_id",
//       //     as: "comment",
//       //   },
//       // },
//       // {
//       //   $lookup: {
//       //     from: "users",
//       //     localField: "comment.user_id",
//       //     foreignField: "_id",
//       //     as: "userComment",
//       //   },
//       // },
//       // {
//       //   $project: {
//       //     "userComment.email": 0,
//       //     "userComment.password": 0,
//       //     "userComment._id": 0,
//       //     "userComment.__v": 0,
//       //   },
//       // },
// */

// /////////////////////////////////////////////////////////////////
// /*
// [
//       {
//         $lookup: {
//           from: "likeproducts",
//           localField: "_id",
//           foreignField: "product_id",
//           as: "likes",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "likes.user_id",
//           foreignField: "_id",
//           as: "userlikes",
//         },
//       },
//       {
//         $project: {
//           "userlikes.email": 0,
//           "userlikes.password": 0,
//           "userlikes._id": 0,
//           "userlikes.__v": 0,
//         },
//       },
//       {
//         $addFields: {
//           total_likes: { $size: { $ifNull: ["$likes", []] } },
//         },
//       },
//       //////////////////////////////////////
//       {
//         $lookup: {
//           from: "dislikeproducts",
//           localField: "_id",
//           foreignField: "product_id",
//           as: "dislikes",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "dislikes.user_id",
//           foreignField: "_id",
//           as: "userdislikes",
//         },
//       },
//       {
//         $project: {
//           "userdislikes.email": 0,
//           "userdislikes.password": 0,
//           "userdislikes._id": 0,
//           "userdislikes.__v": 0,
//         },
//       },
//       {
//         $addFields: {
//           total_dislikes: { $size: { $ifNull: ["$dislikes", []] } },
//         },
//       },
//       //////////////////////////////////////////////////////////////
//       {
//         $lookup: {
//           from: "comments",
//           localField: "_id",
//           foreignField: "product_id",
//           as: "comment",
//         },
//       },
//       {
//         $unwind: "$comment",
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "comment.user_id",
//           foreignField: "_id",
//           as: "userComment",
//         },
//       },
//       {
//         $unwind: "$userComment",
//       },
//       {
//         $group: {
//           _id: "$userComment.name",
//           comments: {
//             $push: "$comment.comment",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           name: "$_id",
//           comments: 1,
//           likes: 1,
//           dislikes: 1,
//           total_likes: 1,
//           total_dislikes: 1,
//         },
//       },
//     ];
// */
