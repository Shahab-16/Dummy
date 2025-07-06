const rabbitmq = require('./rabbitmq');

class EventService {
  constructor() {
    this.exchange = 'order_events';
    this.queueName = 'payment_service_queue';
    this.initialized = false;
  }

  async init() {
    try {
      await rabbitmq.connect();
      await rabbitmq.createExchange(this.exchange);
      await this.createQueueWithRetry();
      this.initialized = true;
      console.log('EventService initialized');
    } catch (error) {
      console.error('EventService init failed:', error);
      setTimeout(() => this.init(), 5000);
    }
  }

  async createQueueWithRetry(retries = 5, delay = 3000) {
    for (let i = 0; i < retries; i++) {
      try {
        await rabbitmq.createQueue(this.queueName);
        await rabbitmq.bindQueue(this.queueName, this.exchange, 'order.created');
        console.log(`Queue ${this.queueName} created and bound`);
        return;
      } catch (error) {
        console.error(`Queue creation failed (attempt ${i+1}/${retries}):`, error);
        if (i < retries - 1) {
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }
    throw new Error(`Failed to create queue after ${retries} attempts`);
  }

  async publishPaymentProcessed(message) {
    if (!this.initialized) await this.init();
    await rabbitmq.publish(this.exchange, 'payment.processed', {
      event: 'PAYMENT_PROCESSED',
      data: message
    });
  }

  async consumeOrderCreated(callback) {
    if (!this.initialized) await this.init();
    
    // Add slight delay to ensure queue exists
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await rabbitmq.consume(this.queueName, (message) => {
      if (message.event === 'ORDER_CREATED') {
        callback(message.data);
      }
    });
  }
}

module.exports = new EventService();