const { Queue } = require('bullmq');
const dotenv = require('dotenv');

dotenv.config();

const connection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
};

// Create the queue for webhook deliveries
const webhookQueue = new Queue('webhook-deliveries', { connection });

module.exports = {
    webhookQueue,
    connection
};
