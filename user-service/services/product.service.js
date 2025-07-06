// services/product.service.js
const amqp = require('amqplib');
let channel;
let correlationMap = new Map();

// Connect to RabbitMQ
const connect = async () => {
  console.log('Connecting to RabbitMQ...');
  const connection = await amqp.connect(process.env.RABBITMQ_URI);
  channel = await connection.createChannel();

  // Assert queues
  await channel.assertQueue('PRODUCT_VALIDATION', { durable: true });
  await channel.assertQueue('PRODUCT_RESPONSE', { durable: true });

  // Start listening to responses once

  console.log('Connected to RabbitMQ');
  channel.consume(
    'PRODUCT_RESPONSE',
    (msg) => {
      const correlationId = msg.properties.correlationId;
      const resolve = correlationMap.get(correlationId);

      if (resolve) {
        const result = JSON.parse(msg.content.toString()).isValid;
        resolve(result);
        correlationMap.delete(correlationId);
      }
    },
    { noAck: true }
  );
};

connect();

// Validate product via RabbitMQ
const validateProduct = (productId) => {
  return new Promise((resolve) => {
    const correlationId = Math.random().toString();

    // Store the resolver
    correlationMap.set(correlationId, resolve);

    // Send validation request
    channel.sendToQueue(
      'PRODUCT_VALIDATION',
      Buffer.from(JSON.stringify({ productId })),
      {
        correlationId,
        replyTo: 'PRODUCT_RESPONSE',
      }
    );
  });
};

module.exports = { validateProduct };
