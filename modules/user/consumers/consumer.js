const userPermissionHandler = require("./userPermissionConsumer");
const { userRegisterConsumer } = require("./userRegisterConsumer");

const consume = () => {
  userRegisterConsumer();
  userPermissionHandler();
};

module.exports = {
  consume,
};
