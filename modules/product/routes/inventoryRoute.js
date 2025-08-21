const express = require("express");

const { getInventoryList } = require("../controllers/inventoryController");

const router = express.Router();

router.get("/inventory-list", getInventoryList);

module.exports = router;
