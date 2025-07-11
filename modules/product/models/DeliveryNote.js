const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const DeliveryNoteSchema = new mongoose.Schema(
  {
    name: { type: DATA_TYPE.STRING },
    orderDate: { type: DATA_TYPE.STRING },
    customer: {
      _id: { type: DATA_TYPE.OBJECT_ID },
      fullname: { type: DATA_TYPE.STRING },
      email: { type: DATA_TYPE.STRING },
      phone: { type: DATA_TYPE.STRING },
    },
    deliveryAddress: { type: DATA_TYPE.STRING },
    estimatedDeliveryDate: { type: DATA_TYPE.STRING },
    products: [
      {
        _id: { type: DATA_TYPE.OBJECT_ID },
        name: { type: DATA_TYPE.STRING },
        unit: { type: DATA_TYPE.STRING },
        price: { type: DATA_TYPE.NUMBER },
        quantity: { type: DATA_TYPE.NUMBER },
      },
    ],
    approvedAt: { type: DATA_TYPE.STRING },
    status: { type: DATA_TYPE.STRING },
  },
  { timestamps: true, collection: "delivery-notes" }
);

module.exports = mongoose.model("DeliveryNote", DeliveryNoteSchema);
