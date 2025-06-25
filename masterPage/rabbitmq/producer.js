const { connectRabbitMQ } = require("./connection");

const assertToQueue = async (queue, message) => {
  try {
    const { channel, connection } = await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Message sent to queue ${queue}:`, message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error sending message to RabbitMQ", error);
  }
};

const assertManyToQueue = async (queue, messages) => {
  try {
    const { channel, connection } = await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true });
    messages.forEach((message) => {
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      console.log(`Message sent to queue ${queue}:`, message);
    });

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error sending message to RabbitMQ", error);
  }
};

module.exports = { assertToQueue, assertManyToQueue };
