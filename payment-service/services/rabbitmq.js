const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBIT_URL;

let connection, channel;

async function connect() {
  if (connection && channel) return;
  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log('✅ Connected to RabbitMQ');
}

async function createExchange(exchangeName) {
  if (!channel) await connect();
  await channel.assertExchange(exchangeName, 'topic', { durable: true });
}

async function createQueue(queueName) {
  if (!channel) await connect();
  await channel.assertQueue(queueName, { durable: true });
}

async function bindQueue(queueName, exchangeName, routingKey) {
  if (!channel) await connect();
  await channel.bindQueue(queueName, exchangeName, routingKey);
}

async function publish(exchangeName, routingKey, data) {
  if (!channel) await connect();
  await channel.assertExchange(exchangeName, 'topic', { durable: true });
  channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data)));
}

async function consume(queueName, callback) {
  if (!channel) await connect();
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      callback(data);
      channel.ack(msg);
    }
  });
}

module.exports = {
  connect,
  createExchange,
  createQueue,
  bindQueue,
  publish,
  consume,
};
