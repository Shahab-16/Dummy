const rabbitmq = require('./rabbitmq');

class EventService {
  constructor() {
    // Define all event queues
    this.queues = {
      ORDER_CREATED: 'order_created',
      ORDER_UPDATED: 'order_updated',
      PAYMENT_PROCESSED: 'payment_processed',
      INVENTORY_UPDATE: 'inventory_update'
    };
  }

  async init() {
    // Initialize all queues
    for (const queue of Object.values(this.queues)) {
      await rabbitmq.createQueue(queue);
    }
  }

  async publishOrderCreated(order) {
    await rabbitmq.publish(this.queues.ORDER_CREATED, {
      event: 'ORDER_CREATED',
      data: order
    });
  }

  async publishOrderUpdated(order) {
    await rabbitmq.publish(this.queues.ORDER_UPDATED, {
      event: 'ORDER_UPDATED',
      data: order
    });
  }

  async consumePaymentProcessed(callback) {
    await rabbitmq.consume(this.queues.PAYMENT_PROCESSED, callback);
  }

  async consumeInventoryUpdate(callback) {
    await rabbitmq.consume(this.queues.INVENTORY_UPDATE, callback);
  }
}

module.exports = new EventService();