const { AccessListConsumer } = require("./AccessListConsumer");
const { UserCompanyConsumer } = require("./UserCompanyConsumer");
const { UserDepartmentConsumer } = require("./UserDepartmentConsumer");

const consume = () => {
  UserDepartmentConsumer();
  UserCompanyConsumer();
  AccessListConsumer();
};

module.exports = {
  consume,
};
