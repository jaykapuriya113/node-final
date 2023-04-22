const mongoose = require("mongoose");
const validator = require("validator");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");
const AppError = require("../errorHandler/AppError");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "please tell us your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "please tell us your password"],
    minlength: 5,
    select: false,
    validate: [validator.isStrongPassword, "please provide a valid password"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not same",
    },
  },
});
userSchema.pre("save", async function (next) {
  const message = `your name is ${this.name} && your password is ${this.password}`;
  try {
    await sendEmail({
      email: this.email,
      subject: "you are create account",
      message: message,
    });
    next();
  } catch (err) {
    throw new Error();
  }
});

userSchema.pre("save", async function (next) {
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  this.passwordConfirm = undefined;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
