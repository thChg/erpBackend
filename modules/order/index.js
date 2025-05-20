const express = require("express");
const cors = require("cors");
const AsyncHandler = require("express-async-handler");

require("dotenv").config({ path: "../../.env" });

const connectToDB = require("../../masterPage/config/databaseConnection");
const errorHandler = require("../../masterPage/middlewares/errorHandler");
const { logInfo } = require("../../masterPage/middlewares/logger");
const cookieParser = require("cookie-parser");
const route = require("./routes/orderRoute");

const PORT = process.env.ORDER_PORT;
const DB_NAME = process.env.ORDER_DB_NAME;

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

app.use(logInfo);
// working on it
app.use("/order", route);

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Auth service is listening on ${PORT}`);
});
