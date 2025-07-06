const rabbitmq = require('./rabbitmq');

class EventService {
  constructor() {
    this.exchange = 'order_events';
  }

  async init() {
    // Initialize queues
    await rabbitmq.connect();
  }

  async publishOrderCreated(order) {
    await rabbitmq.publish(this.exchange, 'order.created', {
      event: 'ORDER_CREATED',
      data: order
    });
  }

  async publishOrderUpdated(order) {
    await rabbitmq.publish(this.exchange, 'order.updated', {
      event: 'ORDER_UPDATED',
      data: order
    });
  }

  async consumePaymentProcessed(callback) {
    const queueName = 'order_service_payment_processed';
    await rabbitmq.consume(queueName, callback);
  }
}

module.exports = new EventService();