const multer = require("multer");
const AppError = require("./errorHandler/AppError");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Product-Images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `product-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not An Image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single("photo");
module.exports = {
  uploadUserPhoto,
};
