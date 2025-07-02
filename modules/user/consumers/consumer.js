const userDataHandler = require("./userDataConsumer");
const { userRegisterConsumer } = require("./userRegisterConsumer");
const userVendorListConsumer = require("./userVendorListConsumer");

const consume = () => {
  userRegisterConsumer();
  userDataHandler();
  userVendorListConsumer();
};

module.exports = {
  consume,
};
