const rabbitmq = require('./rabbitmq');
const Product = require('../models/product.model');

class EventService {
  constructor() {
    this.queues = {
      ORDER_CREATED: 'order_created',
      PAYMENT_PROCESSED: 'payment_processed'
    };
  }

  async init() {
    await rabbitmq.consume(this.queues.ORDER_CREATED, this.handleOrderCreated.bind(this));
    await rabbitmq.consume(this.queues.PAYMENT_PROCESSED, this.handlePaymentProcessed.bind(this));
  }

  async handleOrderCreated(message) {
    console.log('Product Service: Order created event received', message);
    // Reserve inventory (set products as reserved)
    for (const item of message.data.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
  }

  async handlePaymentProcessed(message) {
    console.log('Product Service: Payment processed event received', message);
    // If payment failed, restore inventory
    if (message.data.status === 'failed') {
      for (const item of message.data.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }
    }
  }
}

module.exports = new EventService();