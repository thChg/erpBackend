const mongoose = require("../../../masterPage/config/sharedMongoose");
const { DATA_TYPE } = require("../../../constants/DataType");

const AccountSchema = new mongoose.Schema(
  {
    username: {
      type: DATA_TYPE.STRING,
      required: true,
    },
    password: {
      type: DATA_TYPE.STRING,
      required: true,
    },
  },
  { timestamps: true, collection: "accounts" }
);

module.exports = mongoose.model("Account", AccountSchema);
