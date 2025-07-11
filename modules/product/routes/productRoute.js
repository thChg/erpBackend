const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");const { getInventoryList } = require("../controllers/inventoryController");
const { getProductList, createProduct } = require("../controllers/productController");

const router = express.Router();

router.get("/product-list", AuthValidate, getProductList);
router.post("/create-product", AuthValidate, createProduct);

module.exports = router;
