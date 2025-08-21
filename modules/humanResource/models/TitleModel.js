const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    titleCode: { type: DATA_TYPE.STRING, required: true, unique: true },
    titleName: { type: DATA_TYPE.STRING, required: true, unique: true },
  },

  apiList: API_LIST.CRUD,
};

const titleSchema = new mongoose.Schema(model.data, {timestamps: true})
const Title = mongoose.model("Title", titleSchema);

module.exports = { Title, model };
