const { DATA_TYPE } = require("../../../constants/DataType");
const { default: mongoose } = require("../../../masterPage/config/sharedMongoose");

const AccountantSchema = new mongoose.Schema(
  {
    fullname: { type: DATA_TYPE.STRING },
    email: { type: DATA_TYPE.STRING, required: true },
    user: {
      _id: { type: DATA_TYPE.ID },
      username: { type: DATA_TYPE.STRING },
      role: {
        _id: { type: DATA_TYPE.ID, role: { type: DATA_TYPE.STRING } },
      },
    },
    phone: { type: DATA_TYPE.STRING },
  },
  { timestamps: true, collection: "accountants" }
);

module.exports = mongoose.model("Accountant", AccountantSchema);
