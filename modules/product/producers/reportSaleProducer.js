const { assertToQueue } = require("../../../masterPage/rabbitmq/producer");

const onSaleSuccess = async (message) => {
  await assertToQueue("report.sale", message);
};

module.exports = { onSaleSuccess };
