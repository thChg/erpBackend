const express = require("express");
const { getInventoryList } = require("../controllers/inventoryController");
const {
  getProductList,
  createProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/product-list", getProductList);
router.post("/create-product", createProduct);

module.exports = router;
