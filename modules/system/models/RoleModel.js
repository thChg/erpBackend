const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const mongoose = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    roleCode: {
      type: DATA_TYPE.STRING,
      required: true,
      unique: true,
    },
    roleName: { type: DATA_TYPE.STRING, required: true, unique: true },
    functionList: [
      {
        functionId: { type: DATA_TYPE.STRING },
        functionUrl: { type: DATA_TYPE.STRING },
        functionName: { type: DATA_TYPE.STRING },
        functionOrder: { type: DATA_TYPE.NUMBER },

        parentId: { type: DATA_TYPE.STRING },
        parentUrl: { type: DATA_TYPE.STRING },
        parentName: { type: DATA_TYPE.STRING },
        parentOrder: { type: DATA_TYPE.STRING },

        moduleId: { type: DATA_TYPE.STRING },
        moduleCode: { type: DATA_TYPE.STRING },
        moduleName: { type: DATA_TYPE.STRING },
        moduleOrder: { type: DATA_TYPE.NUMBER },
      },
    ],
  },

  apiList: API_LIST.CRUD,
};

const roleSchema = new mongoose.Schema(model.data, { timestamps: true });
const Role = mongoose.model("Role", roleSchema);

module.exports = { model, Role };
