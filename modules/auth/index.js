const express = require("express");
const cors = require("cors");
const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");

require("dotenv").config({ path: "../../.env" });

const connectToDB = require("../../masterPage/config/databaseConnection");
const errorHandler = require("../../masterPage/middlewares/errorHandler");
const AuthValidate = require("../../masterPage/middlewares/authValidate");
const { logInfo } = require("../../masterPage/middlewares/logger");
const cookieParser = require("cookie-parser");
const Account = require("./models/Account");
const consume = require("./consumers/consumer");
const parseExcel = require("../../masterPage/middlewares/parseExcel");
const createUser = require("./utils/createUser");
const getUserData = require("../../masterPage/functions/getUserData");

const PORT = process.env.AUTH_PORT;
const DB_NAME = process.env.AUTH_DB_NAME;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

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

app.use(logInfo);

app.post(
  "/auth/login",
  AsyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await Account.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res
      .cookie("authToken", token, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({ succes: true, message: "Login successful" });
  })
);

app.post(
  "/auth/register",
  AuthValidate,
  AsyncHandler(async (req, res) => {
    const user = req.user;
    const data = await getUserData(user);
    if (data.role !== "admin") {
      res.status(403);
      throw new Error("You are not authorized to access this resource");
    }
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    // executing functions
    const newAccount = await createUser(username, password, role);

    res.json({
      success: true,
      message: "User created successfully",
      newAccount,
    });
  })
);

app.post(
  "/auth/import",
  AuthValidate,
  parseExcel,
  AsyncHandler(async (req, res) => {
    const user = req.user;
    const permissions = await getUserPermissions(user);
    if (permissions.role !== "admin") {
      res.status(403);
      throw new Error("You are not authorized to access this resource");
    }
    const data = await Promise.all( req.excelData.map( async (item) => {
      const { username, password, roleId : role, apartment } = item;
      if (!username || !password || !role) {
        res.status(400);
        throw new Error("All fields are mandatory!");
      }
      await createUser(username, password, role, apartment);
    }));
      
    res.json({ message: "Import successful", data });
  })
);

app.post("/auth/logout", (req, res) => {
  res.clearCookie("authToken").json({ message: "Logout successful" });
});

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Auth service is listening on ${PORT}`);
});
