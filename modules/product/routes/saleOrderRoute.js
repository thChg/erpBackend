const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  createSaleOrder,
  getSaleOrderList,
  approveSaleOrder,
} = require("../controllers/saleOrderController");

const router = express.Router();

router.post("/create-sale-order", AuthValidate, createSaleOrder);
router.get("/sale-order-list", AuthValidate, getSaleOrderList);
router.post("/approve", AuthValidate, approveSaleOrder);

module.exports = router;
