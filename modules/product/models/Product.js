const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: DATA_TYPE.STRING, required: true, unique: true },
    category: { type: DATA_TYPE.STRING, required: true },
    price: { type: DATA_TYPE.NUMBER, required: true },
    description: { type: DATA_TYPE.STRING },
    vendor: {type: DATA_TYPE.OBJECT_ID, required: true},
  },
  { timestamps: true, collection: "products" }
);

module.exports = mongoose.model("Product", ProductSchema);
