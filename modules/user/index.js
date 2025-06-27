const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("../../masterPage/middlewares/errorHandler");
const connectToDB = require("../../masterPage/config/databaseConnection");
const { consume } = require("./consumers/consumer");
const userRoute = require("./routes/userRoute");
const permissionRoute = require("./routes/permissionRoute");
const menuRoute = require("./routes/menuRoute");
const customerRoute = require("./routes/customerRoute");
const vendorRoute = require("./routes/vendorRoute");
const employeeRoute = require("./routes/employeeRoute");

require("dotenv").config({ path: "../../.env" });

const PORT = process.env.USER_PORT;
const DB_NAME = process.env.USER_DB_NAME;

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
consume();

app.use("/user", userRoute);
app.use("/user/permission", permissionRoute);
app.use("/user/page", menuRoute);
app.use("/user/customer", customerRoute);
app.use("/user/vendor", vendorRoute);
app.use("/user/employee", employeeRoute);

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Employee service is listening on ${PORT}`);
});
