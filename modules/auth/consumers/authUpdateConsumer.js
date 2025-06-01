const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer");
const Account = require("../models/Account");

const authUpdateConsumer = () => {
  consumeMessage("auth:update", async (msg) => {
    const { oldUsername, newUsername } = msg;
    const updatedUser = await Account.findOneAndUpdate(
      { username: oldUsername },
      { username: newUsername },
      { new: true }
    );
    console.log(`User updated: ${updatedUser.username}`);
  });
};

module.exports = authUpdateConsumer;
