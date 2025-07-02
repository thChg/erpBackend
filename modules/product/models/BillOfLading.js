const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const BOLSchema = new mongoose.Schema(
  {
    products: [
      {
        _id: { type: DATA_TYPE.OBJECT_ID },
        name: { type: DATA_TYPE.STRING },
        price: { type: DATA_TYPE.NUMBER },
        quantity: { type: DATA_TYPE.NUMBER },
        unit: { type: DATA_TYPE.STRING },
        purchaseOrder: {
          _id: { type: DATA_TYPE.OBJECT_ID },
          name: { type: DATA_TYPE.STRING },
          status: { type: DATA_TYPE.STRING },
        },
      },
    ],
    name: { type: DATA_TYPE.STRING },
  },
  { timestamps: true, collection: "BOLs" }
);

module.exports = mongoose.model("BOL", BOLSchema);
