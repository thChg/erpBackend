const { DATA_TYPE } = require("../../../constants/DataType");
const { default: mongoose } = require("../../../masterPage/config/sharedMongoose");

const BOLSchema = new mongoose.Schema(
  {
    products: [
      {
        _id: { type: DATA_TYPE.ID },
        name: { type: DATA_TYPE.STRING },
        price: { type: DATA_TYPE.NUMBER },
        quantity: { type: DATA_TYPE.NUMBER },
        unit: { type: DATA_TYPE.STRING },
        purchaseOrder: {
          _id: { type: DATA_TYPE.ID },
          name: { type: DATA_TYPE.STRING },
          orderDate: { type: DATA_TYPE.STRING },

          estimatedDeliveryDate: { type: DATA_TYPE.STRING },
          approvedAt: { type: DATA_TYPE.STRING },
        },
      },
    ],
    name: { type: DATA_TYPE.STRING },
    vendor: {
      _id: { type: DATA_TYPE.ID },
      name: { type: DATA_TYPE.STRING },
      email: { type: DATA_TYPE.STRING },
      phone: { type: DATA_TYPE.STRING },
      address: { type: DATA_TYPE.STRING },
      taxId: { type: DATA_TYPE.STRING },
    },
  },
  { timestamps: true, collection: "BOLs" }
);

module.exports = mongoose.model("BOL", BOLSchema);
