const User = require("../model/userModel");
const AppError = require("../errorHandler/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
/**
 *
 * @param  req name,email,password,confirmPassword
 * @param  res newUser
 * @param  next err
 */
exports.createUsers = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  try {
    if (password.includes(" ") || passwordConfirm.includes(" ")) {
      return next(
        new AppError(
          "your password or passwordConfirm contains unwanted characters",
          400
        )
      );
    }

    const existeuser = await User.find({ email: req.body.email });
    if (existeuser.length > 0) {
      return next(new AppError("Already user exist", 409));
    }

    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      statusCode: 201,
      data: newUser,
    });
  } catch (err) {
    if (err.name == "ValidationError")
      return next(new AppError(err.message, 404));
    return next(new AppError("Your request is not fullfiled.", 404));
  }
};

/**
 *  log in a user
 * @param  req email,password
 * @param  res new user
 * @param  next error
 */
exports.loginUser = async (req, res, next) => {
  // const { email, password } = req.body;
  // try {
  //   if (!email || !password) {
  //     return next(new AppError("Please provide email and password", 400));
  //   }
  //   // if (password.inclues(" "))
  //   //   return next(new AppError("Please provide email and password", 400));
  //   const user = await User.findOne({ email: email }).select("+password");
  //   if (!user) {
  //     return next(new AppError("User not exist", 404));
  //   }
  //   const passwordexist = await bcrypt.compare(password, user.password);
  //   if (passwordexist) {
  //     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
  //       expiresIn: process.env.JWT_EXPIRES_IN,
  //     });
  //     // const token=signToken(user._id);
  //     res.status(200).json({
  //       status: "Success",
  //       statusCode: 200,
  //       data: user,
  //       token,
  //     });
  //   }
  // } catch (err) {
  //   return next(new AppError("Incorrect email or password", 403));
  // }

  try {
    const { email, password } = req.body;
    // console.log(email, password);

    // 1) Check if email and password exist
    if (!email || !password) {
      throw new Error("provide email and password");
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Incorrect email or password");
    }

    // 3) If everything ok, send token to client
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: "Incorrect email or password",
    });
  }
};

/**
 *
 * @param  req id
 * @param  res all users
 * @param  next error
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      statusCode: 200,
      result: users.length,
      data: users,
    });
  } catch (err) {
    return next(new AppError("Data dose not exist", 500));
  }
};
