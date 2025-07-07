const { publishToExchange, subscribeToQueue } = require('./rabbitmq');

const EXCHANGE = 'order_events';
const QUEUES = {
  PAYMENT_PROCESSED: 'order_service_payment_processed',
};

/**
 * Publishes an event that a new order was created
 */
async function publishOrderCreated(order) {
  const event = {
    event: 'ORDER_CREATED',
    data: order,
  };

  await publishToExchange(EXCHANGE, 'order.created', event);
  console.log('📤 ORDER_CREATED event published');
}

/**
 * Publishes an event that an order was updated
 */
async function publishOrderUpdated(order) {
  const event = {
    event: 'ORDER_UPDATED',
    data: order,
  };

  await publishToExchange(EXCHANGE, 'order.updated', event);
  console.log('📤 ORDER_UPDATED event published');
}

/**
 * Subscribes to the PAYMENT_PROCESSED event
 */
async function consumePaymentProcessed(callback) {
  await subscribeToQueue(QUEUES.PAYMENT_PROCESSED, (msg) => {
    const parsed = JSON.parse(msg);
    console.log('📥 Received PAYMENT_PROCESSED:', parsed);
    callback(parsed);
  });
}

module.exports = {
  publishOrderCreated,
  publishOrderUpdated,
  consumePaymentProcessed,
};
