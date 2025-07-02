const { connectRabbitMQ } = require("./connection");

const consumeAndProduce = async (queue, callback) => {
  const { channel } = await connectRabbitMQ();
  await channel.assertQueue(queue, { durable: true });
  console.log(`Waiting for messages in queue ${queue}...`);
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const message = JSON.parse(msg.content.toString());
      console.log(`Message received from queue ${queue}:`, message);

      try {
        const result = await callback(message);
        
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(result)),
          {
            correlationId: msg.properties.correlationId,
            persistent: true,
          }
        );
      } catch (error) {
        console.log(`Error in callback for queue ${queue}:`, error);
      }
    }
    channel.ack(msg);
  });
};

module.exports = consumeAndProduce;
