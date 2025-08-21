const { default: mongoose } = require("mongoose");
const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer");
const { User } = require("../models/UserModel");

const UserDepartmentConsumer = () => {
  consumeMessage("user.department", async (msg) => {
    const { userId, department, departmentManagerId } = msg;
    const updatingData = {
      userId: new mongoose.Types.ObjectId(userId),
      department: {
        departmentId: new mongoose.Types.ObjectId(department.departmentId),
        departmentCode: department.departmentCode,
        departmentName: department.departmentName,

        companyId: new mongoose.Types.ObjectId(department.companyId),
        companyCode: department.companyCode,
        companyName: department.companyName,

        positionId: new mongoose.Types.ObjectId(department.positionId),
        positionCode: department.positionCode,
        positionName: department.positionName,
      },
      departmentManagerId: new mongoose.Types.ObjectId(departmentManagerId),
    };

    await User.findByIdAndUpdate(updatingData.userId, {
      $addToSet: {
        departmentList: updatingData.department,
        departmentManagerId: updatingData.departmentManagerId,
      },
    });
  });
};

module.exports = { UserDepartmentConsumer };
