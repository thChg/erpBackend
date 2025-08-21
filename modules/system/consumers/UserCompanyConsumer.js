const { default: mongoose } = require("mongoose");
const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer");
const { User } = require("../models/UserModel");

const UserCompanyConsumer = async () => {
  await consumeMessage("user.company", async (msg) => {
    const { userId, company, companyCEOId } = msg;

    const updatingData = {
      userId: new mongoose.Types.ObjectId(userId),
      company: {
        companyId: new mongoose.Types.ObjectId(company.companyId),
        companyCode: company.companyCode,
        companyName: company.companyName,
      },
      companyCEOId: new mongoose.Types.ObjectId(companyCEOId),
    };

    await User.findByIdAndUpdate(updatingData.userId, {
      $addToSet: {
        companyList: updatingData.company,
        companyCEOId: updatingData.companyCEOId,
      },
    });
  });
};

module.exports = { UserCompanyConsumer };
