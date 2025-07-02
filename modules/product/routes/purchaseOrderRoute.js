const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  createPurchaseOrder,
  getPurchaseOrderList,
  approvePurchaseOrder
} = require("../controllers/purchaseOrderController");

const router = express.Router();

router.post("/create-purchase-order", AuthValidate, createPurchaseOrder);
router.get("/purchase-order-list", AuthValidate, getPurchaseOrderList);
router.post("/approve", AuthValidate, approvePurchaseOrder)

module.exports = router;
