const AppError = require("../errorHandler/AppError");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    );
    {
      token = req.headers.authorization.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const freshuser = await User.findById(decoded.id);
    if (!freshuser) {
      next(new AppError("you are not log in", 403));
    }

    req.user = freshuser;
    next();
  } catch (err) {
    next(new AppError("you are not log in", 403));
  }
};
module.exports = { protect };
