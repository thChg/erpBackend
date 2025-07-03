const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const SaleSchema = new mongoose.Schema(
  {
    fullname: { type: DATA_TYPE.STRING },
    email: { type: DATA_TYPE.STRING, required: true },
    user: {
      _id: { type: DATA_TYPE.OBJECT_ID },
      username: { type: DATA_TYPE.STRING },
      role: {
        _id: { type: DATA_TYPE.OBJECT_ID, role: { type: DATA_TYPE.STRING } },
      },
    },
    phone: { type: DATA_TYPE.STRING },
  },
  { timestamps: true, collection: "sales" }
);

module.exports = mongoose.model("Sale", SaleSchema);
