const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const InventorySchema = new mongoose.Schema(
  {
    product: {
      _id: {type: DATA_TYPE.OBJECT_ID},
      name: { type: DATA_TYPE.STRING },
      unit: { type: DATA_TYPE.STRING },
      price: { type: DATA_TYPE.NUMBER },
    },
    importQty: { type: DATA_TYPE.NUMBER },
    exportQty: { type: DATA_TYPE.NUMBER },
  },
  { timestamps: true, collection: "inventory" }
);

module.exports = mongoose.model("Inventory", InventorySchema);
