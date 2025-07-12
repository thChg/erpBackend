const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  createPurchaseOrder,
  getPurchaseOrderList,
  resolvePurchaseOrder,
  updatePurchaseOrder,
} = require("../controllers/purchaseOrderController");

const router = express.Router();

router.post("/create-purchase-order", AuthValidate, createPurchaseOrder);
router.get("/purchase-order-list", AuthValidate, getPurchaseOrderList);
router.post("/resolve", AuthValidate, resolvePurchaseOrder);
router.put("/update", AuthValidate, updatePurchaseOrder);

module.exports = router;
