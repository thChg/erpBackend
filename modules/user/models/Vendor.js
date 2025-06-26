const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const VendorSchema = new mongoose.Schema(
  {
    name: { type: DATA_TYPE.STRING, required: true, unique: true },
    email: { type: DATA_TYPE.STRING, required: true, unique: true },
    address: { type: DATA_TYPE.STRING, required: true, unique: true },
    phone: { type: DATA_TYPE.STRING, required: true, unique: true },
    taxId: { type: DATA_TYPE.STRING, required: true, unique: true },
  },
  { timestamps: true, collection: "vedors" }
);

module.exports = mongoose.model("Vendor", VendorSchema);
