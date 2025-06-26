const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer");
const Account = require("../models/Account");

const authDeleteConsumer = () => {
  consumeMessage("auth:delete", async (msg) => {
    const deletingUser = await Account.findOneAndDelete({username: msg});
    console.log(`User deleted: ${deletingUser}`);
  });
};

module.exports = authDeleteConsumer;
