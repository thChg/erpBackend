const express = require("express");

const {
  createPurchaseOrder,
  getPurchaseOrderList,
  resolvePurchaseOrder,
  updatePurchaseOrder,
} = require("../controllers/purchaseOrderController");

const router = express.Router();

router.post("/create-purchase-order", createPurchaseOrder);
router.get("/purchase-order-list", getPurchaseOrderList);
router.post("/resolve", resolvePurchaseOrder);
router.put("/update", updatePurchaseOrder);

module.exports = router;
