const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const InventorySchema = new mongoose.Schema(
  {
    product: { type: DATA_TYPE.OBJECT_ID, required: true },
    quantity: { type: DATA_TYPE.NUMBER, required: true },
    price: { type: DATA_TYPE.NUMBER, required: true },
  },
  { timestamps: true, collection: "inventory" }
);

module.exports = mongoose.model("Inventory", InventorySchema);
