const express = require("express");
const { handleLogin, handleLogOut } = require("../controllers/authController");
const Authenticate = require("../../../masterPage/middlewares/Authenticate");

const router = express.Router();

router.post("/login", handleLogin);
router.post("/log-out", Authenticate, handleLogOut);

module.exports = router;
