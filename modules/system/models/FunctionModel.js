const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    functionName: { type: DATA_TYPE.STRING, required: true },
    functionUrl: { type: DATA_TYPE.STRING, required: true, unique: true },
    functionOrder: { type: DATA_TYPE.NUMBER },
    functionActionList: { type: DATA_TYPE.STRING },

    parentId: { type: DATA_TYPE.ID },
    parentName: { type: DATA_TYPE.STRING },
    parentUrl: { type: DATA_TYPE.STRING },
    parentOrder: { type: DATA_TYPE.NUMBER },

    moduleId: { type: DATA_TYPE.ID, required: true },
    moduleName: { type: DATA_TYPE.STRING, required: true },
    moduleCode: { type: DATA_TYPE.STRING },
    moduleOrder: { type: DATA_TYPE.NUMBER },
  },

  apiList: API_LIST.CRUD,
};

const functionSchema = new mongoose.Schema(model.data, { timestamps: true });
const Function = mongoose.model("Function", functionSchema);

module.exports = { model, Function };
