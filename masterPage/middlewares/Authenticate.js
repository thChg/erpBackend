const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });
const JWT_SECRET = process.env.JWT_SECRET;
const AsyncHandler = require("express-async-handler");

const Authenticate = AsyncHandler((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  const token = req.cookies.authToken;
  console.log("token:", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthenticated");
  }
  next();
});

module.exports = Authenticate;
