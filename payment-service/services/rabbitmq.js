const amqp = require('amqplib');

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = new Set();
  }

  async connect() {
    if (this.connection) return;
    
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      console.log('Payment Service connected to RabbitMQ');
    } catch (error) {
      console.error('RabbitMQ connection error:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async createExchange(exchange, type = 'topic') {
    if (!this.channel) await this.connect();
    await this.channel.assertExchange(exchange, type, { durable: true });
    return exchange;
  }

 async createQueue(queueName) {
    if (!this.channel) await this.connect();
    
    // Check if queue already exists
    if (this.queues.has(queueName)) return queueName;
    
    await this.channel.assertQueue(queueName, { durable: true });
    this.queues.add(queueName);
    return queueName;
  }

  async bindQueue(queue, exchange, pattern) {
    if (!this.channel) await this.connect();
    
    // Check if queue exists
    if (!this.queues.has(queue)) {
      throw new Error(`Queue ${queue} not created`);
    }
    
    await this.channel.bindQueue(queue, exchange, pattern);
  }

  async publish(exchange, routingKey, message) {
    if (!this.channel) await this.connect();
    
    await this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    console.log(`Published to ${exchange}.${routingKey}:`, message);
  }

  async consume(queueName, callback) {
    if (!this.channel) await this.connect();
    
    await this.channel.consume(queueName, (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log(`Received from ${queueName}:`, content);
          callback(content);
          this.channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel.nack(msg);
        }
      }
    });
  }
}

module.exports = new RabbitMQ();