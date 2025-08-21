const express = require("express");

const {
  createOrderPermissions,
  createOrderController,
} = require("../controllers/createOrder");
const {
  getOrderController,
  getOrderPermissions,
} = require("../controllers/getOrder");

const router = express.Router();

router.get("/create/permissions", createOrderPermissions);
router.post("/create", createOrderController);
router.get("/get", getOrderController);
router.get("/get/permissions", getOrderPermissions);

module.exports = router;
