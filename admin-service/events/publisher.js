const { publishToQueue } = require("../services/rabbitmq");

const EVENT_QUEUES = {
  PRODUCT_CREATED: "product_created",
  PRODUCT_DELETED: "product_deleted"
};

async function publishProductCreated(product) {
  console.log('Product Service: Product created event published', product);
  const event = {
    type: "PRODUCT_CREATED",
    timestamp: new Date().toISOString(),
    data: product,
  };

  await publishToQueue(EVENT_QUEUES.PRODUCT_CREATED, JSON.stringify(event));
}

async function publishProductDeleted(productId) {
  const event = {
    type: "PRODUCT_DELETED",
    timestamp: new Date().toISOString(),
    data: { productId },
  };

  await publishToQueue(EVENT_QUEUES.PRODUCT_DELETED, JSON.stringify(event));
}

module.exports = {
  publishProductCreated,
  publishProductDeleted,
};
