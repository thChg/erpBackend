const { userRegisterConsumer } = require("./userRegisterConsumer");

const consume = () => {
  userRegisterConsumer();
};

module.exports = {
  consume,
};
