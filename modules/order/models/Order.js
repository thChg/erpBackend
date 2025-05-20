const { DATA_TYPE } = require("../../../constants/DataType");
const mongoose = require("../../../masterPage/config/sharedMongoose");

const OrderSchema = new mongoose.Schema(
  {
    name: {
      type: DATA_TYPE.STRING,
      required: true,
    },
    employee: {
      type: DATA_TYPE.STRING,
      required: true,
    },
    apartment: {
      type: DATA_TYPE.STRING,
      required: true,
    },
    items: [
      {
        item: {
          type: DATA_TYPE.STRING,
          required: true,
        },
        quantity: {
          type: DATA_TYPE.NUMBER,
          required: true,
        },
      },
    ],
    status: {
      type: DATA_TYPE.STRING,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

module.exports = mongoose.model("Order", OrderSchema);
