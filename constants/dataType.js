const { default: mongoose } = require("../masterPage/config/sharedMongoose");

const DATA_TYPE = {
  ID: String,
  STRING: String,
  BOOLEAN: Boolean,
  OBJECT_ID: mongoose.Schema.Types.ObjectId,
  NUMBER: Number,
};

module.exports = { DATA_TYPE };
