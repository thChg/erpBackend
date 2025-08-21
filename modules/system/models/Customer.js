const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const CustomerSchema = new mongoose.Schema(
  {
    fullname: { type: DATA_TYPE.STRING, required: true },
    email: { type: DATA_TYPE.STRING, required: true, unique: true },
    phone: { type: DATA_TYPE.STRING, required: true, unique: true },
  },
  { timestamps: true, collection: "customers" }
);


module.exports = mongoose.model("Customer", CustomerSchema);