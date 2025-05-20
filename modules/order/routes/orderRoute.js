const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  createOrderPermissions,
  createOrderController,
} = require("../controllers/createOrder");
const {
  getOrderController,
  getOrderPermissions,
} = require("../controllers/getOrder");

const router = express.Router();

router.get("/create/permissions", AuthValidate, createOrderPermissions);
router.post("/create", AuthValidate, createOrderController);
router.get("/get", AuthValidate, getOrderController);
router.get("/get/permissions", AuthValidate, getOrderPermissions);

module.exports = router;
