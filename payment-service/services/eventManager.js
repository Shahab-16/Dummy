const rabbitmq = require('./rabbitmq');

const EXCHANGE = 'order_events';
const QUEUE_NAME = 'payment_service_queue';
const ROUTING_KEYS = {
  ORDER_CREATED: 'order.created',
  PAYMENT_PROCESSED: 'payment.processed',
};

let initialized = false;

async function initEventInfrastructure(retries = 5, delay = 3000) {
  try {
    await rabbitmq.connect();
    await rabbitmq.createExchange(EXCHANGE);
    await createQueueWithRetry(retries, delay);
    initialized = true;
    console.log('✅ Event infrastructure initialized');
  } catch (err) {
    console.error('❌ Initialization failed:', err);
    setTimeout(() => initEventInfrastructure(retries, delay), 5000);
  }
}

async function createQueueWithRetry(retries, delay) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await rabbitmq.createQueue(QUEUE_NAME);
      await rabbitmq.bindQueue(QUEUE_NAME, EXCHANGE, ROUTING_KEYS.ORDER_CREATED);
      console.log(`✅ Queue "${QUEUE_NAME}" created and bound`);
      return;
    } catch (error) {
      console.error(`❌ Attempt ${attempt}/${retries} failed:`, error);
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  throw new Error(`❌ Failed to create queue after ${retries} attempts`);
}

async function publishPaymentProcessed(data) {
  if (!initialized) await initEventInfrastructure();
  await rabbitmq.publish(EXCHANGE, ROUTING_KEYS.PAYMENT_PROCESSED, {
    event: 'PAYMENT_PROCESSED',
    data,
  });
  console.log('📤 PAYMENT_PROCESSED published');
}

async function consumeOrderCreated(callback) {
  if (!initialized) await initEventInfrastructure();

  await new Promise(res => setTimeout(res, 500)); // Ensure queue bind delay

  await rabbitmq.consume(QUEUE_NAME, (message) => {
    if (message.event === 'ORDER_CREATED') {
      console.log('📥 ORDER_CREATED received');
      callback(message.data);
    }
  });
}

module.exports = {
  initEventInfrastructure,
  publishPaymentProcessed,
  consumeOrderCreated,
};
