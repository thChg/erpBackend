const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer");
const Account = require("../models/Account");
const { hash } = require("bcrypt");
const authRegisterConsumer = () => {
  consumeMessage("auth:register", async (msg) => {
    const { username, password } = msg;
    const hashed = await hash(password, 10);
    await Account.create({ username: username, password: hashed });
    console.log(`New user ${username} registered successfully`);
  });
};

module.exports = authRegisterConsumer;
