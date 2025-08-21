const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    serviceCode: { type: DATA_TYPE.STRING, required: true, unique: true },
    serviceName: { type: DATA_TYPE.STRING, required: true, unique: true },

    actionList: [
      {
        actionCode: { type: DATA_TYPE.STRING },
        method: { type: DATA_TYPE.STRING },
        path: { type: DATA_TYPE.STRING },
      },
    ],

    fieldList: [
      {
        fieldName: { type: DATA_TYPE.STRING },
        fieldType: { type: DATA_TYPE.STRING },
        required: { type: DATA_TYPE.BOOLEAN },
      },
    ],
  },

  apiList: API_LIST.CRUD,
};

const resourceSchema = new mongoose.Schema(model.data, { timestamps: true });
const Resource = mongoose.model("Resource", resourceSchema);

module.exports = { Resource, model };
