const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    departmentCode: {
      type: DATA_TYPE.STRING,
      required: true,
      unique: true,
    },
    departmentName: { type: DATA_TYPE.STRING, required: true },
    departmentAddress: { type: DATA_TYPE.STRING },

    managerId: { type: DATA_TYPE.ID },
    managerUsername: { type: DATA_TYPE.STRING },
    managerFullname: { type: DATA_TYPE.STRING },

    companyId: { type: DATA_TYPE.ID },
    companyCode: { type: DATA_TYPE.STRING, required: true },
    companyName: { type: DATA_TYPE.STRING, required: true },
    companyCEOId: { type: DATA_TYPE.ID },
    companyCEOUsername: { type: DATA_TYPE.STRING },
    companyCEOFullname: { type: DATA_TYPE.STRING },

    staffList: [
      {
        staffId: { type: DATA_TYPE.ID },
        staffUsername: { type: DATA_TYPE.STRING },
        staffFullname: { type: DATA_TYPE.STRING },

        positionId: { type: DATA_TYPE.ID },
        positionCode: { type: DATA_TYPE.STRING },
        positionName: { type: DATA_TYPE.STRING },

        titleCode: { type: DATA_TYPE.STRING },
        titleName: { type: DATA_TYPE.STRING },
      },
    ],
  },

  apiList: API_LIST.CRUD,
};

const departmentSchema = new mongoose.Schema(model.data, {timestamps: true})
const Department = mongoose.model("Department", departmentSchema);

module.exports = { Department, model };
