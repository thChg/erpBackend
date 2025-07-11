const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const FiscalPeriodSchema = new mongoose.Schema(
  {
    openDate: DATA_TYPE.STRING,
    closeDate: DATA_TYPE.STRING,
    status: DATA_TYPE.STRING,
  },
  { timestamps: true, collection: "fiscal-periods" }
);

module.exports = mongoose.model("FiscalPeriod", FiscalPeriodSchema);
