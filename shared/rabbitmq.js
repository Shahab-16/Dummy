const amqp = require('amqplib');

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URI);
    this.channel = await this.connection.createChannel();
  }

  async publish(queue, message) {
    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async consume(queue, callback) {
    await this.channel.assertQueue(queue);
    this.channel.consume(queue, (msg) => {
      callback(JSON.parse(msg.content.toString()));
      this.channel.ack(msg);
    });
  }
}

module.exports = new RabbitMQ();