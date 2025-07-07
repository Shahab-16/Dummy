const rabbitmq = require('./rabbitmq');
const Product = require('../models/product.model');

const QUEUES = {
  ORDER_CREATED: 'order_created',
  PAYMENT_PROCESSED: 'payment_processed',
};

async function initEventHandlers() {
  await rabbitmq.connect();

  await rabbitmq.subscribeToQueue(QUEUES.ORDER_CREATED, handleOrderCreated);
  await rabbitmq.subscribeToQueue(QUEUES.PAYMENT_PROCESSED, handlePaymentProcessed);

  console.log('✅ Product Service event handlers subscribed');
}

async function handleOrderCreated(message) {
  console.log('📥 Product Service received ORDER_CREATED:', message);

  try {
    for (const item of message.data.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    console.log('✅ Inventory reserved');
  } catch (err) {
    console.error('❌ Error updating stock on order creation:', err);
  }
}

async function handlePaymentProcessed(message) {
  console.log('📥 Product Service received PAYMENT_PROCESSED:', message);

  if (message.data.status === 'failed') {
    try {
      for (const item of message.data.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }
      console.log('✅ Inventory restored due to failed payment');
    } catch (err) {
      console.error('❌ Error restoring stock after payment failure:', err);
    }
  }
}

module.exports = {
  initEventHandlers,
};
