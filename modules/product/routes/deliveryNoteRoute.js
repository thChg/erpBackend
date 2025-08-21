const express = require("express");

const {
  getDeliveryNoteList,
  resolveDeliveryNote,
} = require("../controllers/deliveryNoteController");

const router = express.Router();

router.get("/delivery-note-list", getDeliveryNoteList);
router.post("/resolve/:id", resolveDeliveryNote);

module.exports = router;
