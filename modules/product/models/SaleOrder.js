const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const SaleOrderSchema = new mongoose.Schema(
  {
    products: [
      {
        _id: { type: DATA_TYPE.OBJECT_ID },
        name: { type: DATA_TYPE.STRING },
        unit: { type: DATA_TYPE.STRING },
        price: { type: DATA_TYPE.NUMBER },
        quantity: { type: DATA_TYPE.NUMBER },
      },
    ],
    status: { type: DATA_TYPE.STRING },
  },
  { timestamps: true, collection: "sale-orders" }
);

module.exports = mongoose.model("SaleOrder", SaleOrderSchema);
