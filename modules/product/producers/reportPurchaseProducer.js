const { assertToQueue } = require("../../../masterPage/rabbitmq/producer");

const onPurchaseSuccess = async (message) => {
  await assertToQueue("report.purchase", message);
};

module.exports = { onPurchaseSuccess };
