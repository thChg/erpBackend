const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  getProductList,
  createProduct,
  printVendorProductList,
  getVendorProductData
} = require("../controllers/productController");

const router = express.Router();

router.get("/product-list", AuthValidate, getProductList);
router.post("/create-product", AuthValidate, createProduct);
router.post("/print", AuthValidate, printVendorProductList);
router.post("/product-data", AuthValidate, getVendorProductData);

module.exports = router;
