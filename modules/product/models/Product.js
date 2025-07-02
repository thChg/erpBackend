const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: DATA_TYPE.STRING, required: true, unique: true },
    price: { type: DATA_TYPE.NUMBER },
    unit: { type: DATA_TYPE.STRING },
  },
  { timestamps: true, collection: "products" }
);

module.exports = mongoose.model("Product", ProductSchema);
