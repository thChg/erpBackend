const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer");
const StockJournal = require("../models/StockJournal");

const reportPurchaseConsumer = () => {
  consumeMessage("report.purchase", async (msg) => {
    const { products, name, _id } = msg;

    await Promise.all(
      products.map(async (p) => {
        const product = {
          _id: p._id,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          unit: p.unit,
        };
        await StockJournal.create({
          product,
          action: "purchase",
          order: { _id, name },
        });
      })
    );
  });
};

module.exports = { reportPurchaseConsumer };
