const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer");
const Account = require("../models/Account");

const authDeleteConsumer = () => {
  consumeMessage("auth:delete", async (msg) => {
    const { username } = msg;
    const deletingUser = await Account.findOneAndDelete({ username });
    console.log(`User deleted: ${deletingUser.username}`);
  });
};

module.exports = authDeleteConsumer;
