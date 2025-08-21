const { default: mongoose } = require("../masterPage/config/sharedMongoose");

const DATA_TYPE = {
  STRING: String,
  BOOLEAN: Boolean,
  ID: mongoose.Schema.Types.ObjectId,
  NUMBER: Number,
  TIME: mongoose.Schema.Types.Date,
  ARRAY: mongoose.Schema.Types.Array,
};

module.exports = { DATA_TYPE };
