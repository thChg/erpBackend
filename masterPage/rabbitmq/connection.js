const amqp = require("amqplib");
let connection, channel;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    return { channel, connection };
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
};

module.exports = { connectRabbitMQ };
