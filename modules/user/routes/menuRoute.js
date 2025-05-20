const express = require ("express");
const router = express.Router();
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const { addToMenu } = require("../controllers/menuController");


router.post("/create-page", AuthValidate, addToMenu)

module.exports = router;