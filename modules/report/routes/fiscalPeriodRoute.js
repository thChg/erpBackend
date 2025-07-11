const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  getFiscalPeriodList,
  createFiscalPeriod,
  closeFiscalPeriod,
} = require("../controllers/fiscalPeriodController");

const router = express.Router();

router.get("/fiscal-period-list", AuthValidate, getFiscalPeriodList);
router.post("/create-fiscal-period", AuthValidate, createFiscalPeriod);
router.put("/close-fiscal-period/:id", AuthValidate, closeFiscalPeriod);

module.exports = router;
