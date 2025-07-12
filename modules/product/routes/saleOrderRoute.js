const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  createSaleOrder,
  getSaleOrderList,
  resolveSaleOrder,
  updateSaleOrder,
  deleteSaleOrder
} = require("../controllers/saleOrderController");

const router = express.Router();

router.post("/create-sale-order", AuthValidate, createSaleOrder);
router.get("/sale-order-list", AuthValidate, getSaleOrderList);
router.post("/resolve", AuthValidate, resolveSaleOrder);
router.put("/update", AuthValidate, updateSaleOrder);
router.delete("/delete/:id", AuthValidate, deleteSaleOrder)

module.exports = router;
