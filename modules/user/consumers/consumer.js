const userDataHandler = require("./userDataConsumer");
const { userRegisterConsumer } = require("./userRegisterConsumer");

const consume = () => {
  userRegisterConsumer();
  userDataHandler();
};

module.exports = {
  consume,
};
