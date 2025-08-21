const AsyncHandler = require("express-async-handler");
const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../../.env" });
const { User } = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const handleLogin = AsyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ $or: [{ username }, { email: username }] });

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
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({ succes: true, message: "Login successful" });
});

const handleLogOut = AsyncHandler(async (req, res) => {
  res.clearCookie("authToken").json({ message: "Logout successful" });
});

module.exports = { handleLogin, handleLogOut };
