const express = require("express");

const {
  getFiscalPeriodList,
  createFiscalPeriod,
  closeFiscalPeriod,
} = require("../controllers/fiscalPeriodController");

const router = express.Router();

router.get("/fiscal-period-list", getFiscalPeriodList);
router.post("/create-fiscal-period", createFiscalPeriod);
router.put("/close-fiscal-period/:id", closeFiscalPeriod);

module.exports = router;
