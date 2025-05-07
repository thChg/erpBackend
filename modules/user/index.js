const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AsyncHandler = require("express-async-handler");
const errorHandler = require("../../masterPage/middlewares/errorHandler");
const connectToDB = require("../../masterPage/config/databaseConnection");
const { consume } = require("./consumers/consumer");
const AuthValidate = require("../../masterPage/middlewares/authValidate");
const User = require("./models/User");
require("dotenv").config({path: "../../.env"});

const PORT = process.env.USER_PORT;
const DB_NAME = process.env.USER_DB_NAME;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(cookieParser());

connectToDB(DB_NAME);
// Consume the message from the queue (RabbitMQ)
consume();

app.get(
  "/user/me",
  AuthValidate,
  AsyncHandler(async (req, res) => {
    const user = req.user;

    const userData = await User.findOne({ username: user.username });

    res.json({
      success: true,
      message: "User data retrieved successfully",
      data: userData,
    });
  })
);

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Employee service is listening on ${PORT}`);
});
