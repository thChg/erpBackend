const express = require("express");

const {
  createSaleOrder,
  getSaleOrderList,
  resolveSaleOrder,
  updateSaleOrder,
  deleteSaleOrder,
} = require("../controllers/saleOrderController");

const router = express.Router();

router.post("/create-sale-order", createSaleOrder);
router.get("/sale-order-list", getSaleOrderList);
router.post("/resolve", resolveSaleOrder);
router.put("/update", updateSaleOrder);
router.delete("/delete/:id", deleteSaleOrder);

module.exports = router;
