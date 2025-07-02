const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const { getInventoryList } = require("../controllers/inventoryController");

const router = express.Router();

router.get("/inventory-list", AuthValidate, getInventoryList);

module.exports = router;
