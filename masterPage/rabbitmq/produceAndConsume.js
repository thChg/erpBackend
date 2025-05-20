const { connectRabbitMQ } = require("./connection");

const produceAndConsume = async (queue, message) => {
    const { channel } = await connectRabbitMQ();
    //tao queue
    const q = await channel.assertQueue(``, { durable: false });
    //tao correlation id
    const correlationId = Math.random().toString(16).slice(2);
    // boc promise
    return new Promise((resolve) => {
      //lay message to queue
      channel.consume(q.queue, (msg) => {
        if (msg.properties.correlationId === correlationId) {
          const response = JSON.parse(msg.content.toString());
          console.log(`Message received from queue ${q.queue}:`, response);
          resolve(response);
          channel.ack(msg);
        }
      });
      //gui toi queue cua user

      channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        {
          correlationId: correlationId,
          replyTo: q.queue,
        }
      );

    })
}

module.exports = produceAndConsume