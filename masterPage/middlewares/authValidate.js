const jwt = require("jsonwebtoken");
require("dotenv").config({path: "../../.env"});
const JWT_SECRET = process.env.JWT_SECRET;
const AsyncHandler = require("express-async-handler");

const AuthValidate = AsyncHandler((req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  req.user = decoded;
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  next();
});

module.exports = AuthValidate;
