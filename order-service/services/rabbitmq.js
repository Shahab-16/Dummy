const amqp = require('amqplib');

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = {};
  }

  async connect() {
    if (this.connection) return;
    
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('RabbitMQ connection error:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async createQueue(queueName) {
    if (!this.channel) await this.connect();
    await this.channel.assertQueue(queueName, { durable: true });
    this.queues[queueName] = true;
    return queueName;
  }

  async publish(queueName, message) {
    if (!this.queues[queueName]) {
      await this.createQueue(queueName);
    }
    
    this.channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    console.log(`Published to ${queueName}:`, message);
  }

  async consume(queueName, callback) {
    if (!this.queues[queueName]) {
      await this.createQueue(queueName);
    }
    
    this.channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log(`Received from ${queueName}:`, content);
        callback(content);
        this.channel.ack(msg);
      }
    });
  }
}

module.exports = new RabbitMQ();