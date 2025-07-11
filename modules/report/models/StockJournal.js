const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const StockJournalSchema = new mongoose.Schema(
  {
    product: {
      _id: { type: DATA_TYPE.OBJECT_ID },
      name: { type: DATA_TYPE.STRING },
      price: { type: DATA_TYPE.NUMBER },
      quantity: { type: DATA_TYPE.NUMBER },
      unit: { type: DATA_TYPE.STRING },
    },
    action: { type: DATA_TYPE.STRING },
    order: {
      _id: { type: DATA_TYPE.OBJECT_ID },
      name: { type: DATA_TYPE.STRING },
    },
  },
  { timestamps: true, collection: "stock-journal" }
);

module.exports = mongoose.model("StockJournal", StockJournalSchema);
