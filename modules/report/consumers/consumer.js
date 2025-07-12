const { reportPurchaseConsumer } = require("./reportPurchaseConsumer");
const { reportSaleConsumer } = require("./reportSaleConsumer");

const consume = () => {
  reportPurchaseConsumer();
  reportSaleConsumer();
};

module.exports = { consume };
