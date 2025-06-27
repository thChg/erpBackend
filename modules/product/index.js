const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("../../masterPage/middlewares/errorHandler");
const connectToDB = require("../../masterPage/config/databaseConnection");

const vendorRoute = require("./routes/vendorRoute");

require("dotenv").config({ path: "../../.env" });

const PORT = process.env.PRODUCT_PORT;
const DB_NAME = process.env.PRODUCT_DB_NAME;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

connectToDB(DB_NAME);
app.use("/product/vendor", vendorRoute)
// app.use("/product/employee", employeeRoute)

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Employee service is listening on ${PORT}`);
});
