const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBIT_URL;

let connection, channel;

async function connect() {
  if (connection && channel) return;
  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log('✅ Connected to RabbitMQ');
}

async function assertQueue(queueName) {
  if (!channel) await connect();
  await channel.assertQueue(queueName, { durable: true });
}

async function publishToQueue(queueName, data) {
  if (!channel) await connect();
  await assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
}

async function subscribeToQueue(queueName, callback) {
  if (!channel) await connect();
  await assertQueue(queueName);
  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel.ack(msg);
    }
  });
}

module.exports = {
  connect,
  publishToQueue,
  subscribeToQueue,
};
