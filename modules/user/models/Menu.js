const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const MenuSchema = mongoose.Schema(
  {
    menu: {
      type: DATA_TYPE.STRING,
      required: true,
      unique: true,
    },
    subMenu: [{ type: DATA_TYPE.STRING, required: true }],
  },
  { timestamps: true, collection: "menus" }
);

module.exports = mongoose.model("Menu", MenuSchema);
