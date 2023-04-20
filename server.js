const express = require("express");
require("dotenv").config();
const app = express();
const AppError = require("./errorHandler/AppError");
const DB = require("./db/conn");
const userRouter = require("./router/userRouter");
const productRouter = require("./router/productRouter");
const productTypeRouter = require("./router/productTypeRouter");
const globalErrorHandler = require("./errorHandler/globalErrorHandler");

app.use(express.json());
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/productsType", productTypeRouter);

app.all("*", (req, res, next) => {
  return next(
    new AppError("This route is not yet defined in this application", 400)
  );
});
app.use(globalErrorHandler);
DB();
const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}...`);
});
