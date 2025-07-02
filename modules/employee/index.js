const express = require("express");
const errorHandler = require("../../masterPage/middlewares/errorHandler");
const cors = require("cors");
const connectToDB = require("../../masterPage/config/databaseConnection");
const { logInfo } = require("../../masterPage/middlewares/logger");
const cookieParser = require("cookie-parser");
const accountantRoute = require("../user/routes/accountantRoute");

require("dotenv").config({ path: "../../.env" });

const PORT = process.env.EMPLOYEE_PORT;
const DB_NAME = process.env.EMPLOYEE_DB_NAME;
const CLIENT_URL = process.env.CLIENT_URL;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

connectToDB(DB_NAME);

app.use(logInfo);
app.use("/employee/accountant", accountantRoute);

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Employee service is listening on ${PORT}`);
});
