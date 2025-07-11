const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  getDeliveryNoteList,
  resolveDeliveryNote,
} = require("../controllers/deliveryNoteController");

const router = express.Router();

router.get("/delivery-note-list", AuthValidate, getDeliveryNoteList);
router.post("/resolve/:id", AuthValidate, resolveDeliveryNote);

module.exports = router;
