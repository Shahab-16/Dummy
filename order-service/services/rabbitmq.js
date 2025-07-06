const amqp = require('amqplib');

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (this.connection) return;
    
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      console.log('Order Service connected to RabbitMQ');
    } catch (error) {
      console.error('RabbitMQ connection error:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async createQueue(queueName) {
    if (!this.channel) await this.connect();
    await this.channel.assertQueue(queueName, { durable: true });
    return queueName;
  }

  async publish(exchange, routingKey, message) {
    if (!this.channel) await this.connect();
    
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    console.log(`Published to ${exchange}.${routingKey}:`, message);
  }

  async consume(queueName, callback) {
    if (!this.channel) await this.connect();
    
    await this.channel.assertQueue(queueName, { durable: true });
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