const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer");
const StockJournal = require("../models/StockJournal");

const reportSaleConsumer = () => {
  consumeMessage("report.sale", async (msg) => {
    const { _id, name, products } = msg;

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
          action: "sale",
          order: { _id, name },
        });
      })
    );
  });
};

module.exports = { reportSaleConsumer };
