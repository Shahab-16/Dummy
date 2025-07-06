const rabbitmq = require('./rabbitmq');

class EventService {
  constructor() {
    this.queues = {
      ORDER_CREATED: 'order_created',
      ORDER_UPDATED: 'order_updated'
    };
  }

  async init() {
    await rabbitmq.consume(this.queues.ORDER_CREATED, this.handleOrderCreated.bind(this));
    await rabbitmq.consume(this.queues.ORDER_UPDATED, this.handleOrderUpdated.bind(this));
  }

  async handleOrderCreated(message) {
    console.log('User Service: Order created event received', message);
    // Update user's order history
    // In real app: add order to user's order history
  }

  async handleOrderUpdated(message) {
    console.log('User Service: Order updated event received', message);
    // Notify user about order status change
    // In real app: send email/notification to user
  }
}

module.exports = new EventService();