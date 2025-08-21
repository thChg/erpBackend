const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    companyCode: { type: DATA_TYPE.STRING, unique: true },
    companyName: { type: DATA_TYPE.STRING, unique: true },
    companyTaxCode: { type: DATA_TYPE.STRING, unique: true },
    companyPhone: { type: DATA_TYPE.STRING },
    companyAddress: { type: DATA_TYPE.STRING },
    companyEmail: { type: DATA_TYPE.STRING },

    companyCEOId: { type: DATA_TYPE.ID },
    companyCEOUsername: { type: DATA_TYPE.STRING },
    companyCEOFullname: { type: DATA_TYPE.STRING },

    departmentList: [
      {
        departmentId: { type: DATA_TYPE.ID },
        departmentCode: { type: DATA_TYPE.STRING },
        departmentName: { type: DATA_TYPE.STRING },

        managerId: { type: DATA_TYPE.ID },
        managerUsername: { type: DATA_TYPE.STRING },
        managerFullname: { type: DATA_TYPE.STRING },
      },
    ],

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

        departmentId: { type: DATA_TYPE.ID },
        departmentCode: { type: DATA_TYPE.STRING },
        departmentName: { type: DATA_TYPE.STRING },
      },
    ],
  },

  apiList: API_LIST.CRD,
};

const companySchema = new mongoose.Schema(model.data, {timestamps: true})
const Company = mongoose.model("Company", companySchema);

module.exports = { Company, model };
