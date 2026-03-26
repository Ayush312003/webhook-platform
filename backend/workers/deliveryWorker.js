const { Worker } = require('bullmq');
const axios = require('axios');
const Event = require('../models/Event');
const WebhookEndpoint = require('../models/WebhookEndpoint');
const DeliveryAttempt = require('../models/DeliveryAttempt');
const { connection, webhookQueue } = require('../services/queue');

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 5000; // 5 seconds

const deliveryWorker = new Worker('webhook-deliveries', async (job) => {
    const { eventId, webhookId } = job.data;

    // Find the corresponding pending delivery attempt
    const attempt = await DeliveryAttempt.findOne({ eventId, webhookId, status: 'PENDING' });
    
    // If no pending attempt is found, it might have been already processed or deleted
    if (!attempt) {
        console.log(`[Worker] No pending delivery attempt found for Event:${eventId} Webhook:${webhookId}`);
        return;
    }

    try {
        const event = await Event.findById(eventId);
        const webhook = await WebhookEndpoint.findById(webhookId);

        if (!event || !webhook) {
            throw new Error('Associated Event or Webhook not found in the database');
        }

        // Send the HTTP POST request with Axios
        await axios.post(webhook.url, event.payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000 // Time out after 5 seconds to prevent hanging jobs
        });

        // If successful, update the attempt status
        attempt.status = 'SUCCESS';
        await attempt.save();
        
        console.log(`[Worker] Successfully delivered Event:${eventId} to ${webhook.url}`);
    } catch (error) {
        if (attempt.retryCount < MAX_RETRIES) {
            attempt.retryCount += 1;
            const delay = Math.pow(2, attempt.retryCount) * BASE_DELAY_MS;
            attempt.nextRetryAt = new Date(Date.now() + delay);
            await attempt.save();

            console.warn(`[Worker] Delivery failed. Event:${eventId}. Retrying ${attempt.retryCount}/${MAX_RETRIES} in ${delay}ms`);
            
            // Requeue the job with calculated delay
            await webhookQueue.add('deliver-webhook', { eventId, webhookId }, { delay });
        } else {
            // Max retries reached
            attempt.status = 'FAILED';
            await attempt.save();
            console.error(`[Worker] Permanently failed after ${MAX_RETRIES} retries for Event:${eventId}. Error: ${error.message}`);
        }
        
        throw error; // Let BullMQ know this specific job iteration failed
    }
}, { connection });

deliveryWorker.on('completed', (job) => {
    // Optional logging of job completion
});

deliveryWorker.on('failed', (job, err) => {
    // Optional logging of job failure
});

module.exports = deliveryWorker;
