const { connectRabbitMQ } = require("./connection");

const consumeMessage = async (queue, callback) => {
  try {
    const {channel} = await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in queue ${queue}...`);
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        callback(message);
        console.log(`Message received from queue ${queue}:`, message);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error consuming message from RabbitMQ", error);
  }
}

module.exports = {
  consumeMessage
}