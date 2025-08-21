const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const mongoose = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    moduleCode: { type: DATA_TYPE.STRING, unique: true },
    moduleName: { type: DATA_TYPE.STRING, unique: true },
    moduleOrder: { type: DATA_TYPE.NUMBER },
  },

  apiList: API_LIST.CRUD,
};

const moduleSchema = new mongoose.Schema(model.data, { timestamps: true });
const Module = mongoose.model("Module", moduleSchema);

module.exports = { Module, model };
