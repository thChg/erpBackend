const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    positionCode: { type: DATA_TYPE.STRING, required: true, unique: true },
    positionName: { type: DATA_TYPE.STRING, required: true, unique: true },

    titleId: { type: DATA_TYPE.ID },
    titleCode: { type: DATA_TYPE.STRING },
    titleName: { type: DATA_TYPE.STRING },
  },

  apiList: API_LIST.CRUD,
};

const positionSchema = new mongoose.Schema(model.data, { timestamps: true });
const Position = mongoose.model("Position", positionSchema);

module.exports = { Position, model };
