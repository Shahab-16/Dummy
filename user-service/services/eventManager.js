const { subscribeToQueue, publishToQueue } = require('./rabbitmq');

const QUEUES = {
  ORDER_CREATED: 'order_created',
  ORDER_UPDATED: 'order_updated',
  PRODUCT_VALIDATION: 'PRODUCT_VALIDATION',
  PRODUCT_RESPONSE: 'PRODUCT_RESPONSE',
};

let correlationMap = new Map();

// 🔹 INIT — bind all subscriptions
async function initEventListeners() {
  await subscribeToQueue(QUEUES.ORDER_CREATED, handleOrderCreated);
  await subscribeToQueue(QUEUES.ORDER_UPDATED, handleOrderUpdated);
  await subscribeToQueue(QUEUES.PRODUCT_RESPONSE, handleProductValidationResponse);
  console.log('✅ Subscribed to all event queues');
}

// 🔹 HANDLERS
function handleOrderCreated(message) {
  const data = JSON.parse(message);
  console.log('📦 ORDER_CREATED received:', data);
  // Add to user history or DB update
}

function handleOrderUpdated(message) {
  const data = JSON.parse(message);
  console.log('📦 ORDER_UPDATED received:', data);
  // Notify user or update UI status
}

function handleProductValidationResponse(message, msgMeta) {
  const correlationId = msgMeta.properties.correlationId;
  const result = JSON.parse(message).isValid;
  const resolver = correlationMap.get(correlationId);
  if (resolver) {
    resolver(result);
    correlationMap.delete(correlationId);
  }
}

// 🔹 PRODUCT VALIDATION Publisher (RPC-style)
function validateProduct(productId) {
  return new Promise((resolve) => {
    const correlationId = Math.random().toString();
    correlationMap.set(correlationId, resolve);
    const payload = JSON.stringify({ productId });

    publishToQueue(QUEUES.PRODUCT_VALIDATION, payload, {
      correlationId,
      replyTo: QUEUES.PRODUCT_RESPONSE,
    });
  });
}

module.exports = {
  initEventListeners,
  validateProduct,
};
