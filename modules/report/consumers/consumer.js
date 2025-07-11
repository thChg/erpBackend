const { reportPurchaseConsumer } = require("./reportPurchaseConsumer");

const consume = () => {
    reportPurchaseConsumer()
};

module.exports = { consume };
