const Event = require('../models/Event');
const WebhookEndpoint = require('../models/WebhookEndpoint');
const DeliveryAttempt = require('../models/DeliveryAttempt');
const { webhookQueue } = require('../services/queue');

// @route   POST /api/events
// @desc    Create a new event and queue delivery attempts for all endpoints
exports.createEvent = async (req, res) => {
    try {
        const { type, payload, webhookIds } = req.body;
        
        if (!type || !payload) {
            return res.status(400).json({ error: 'type and payload are required' });
        }

        // 1. Create the event
        const event = await Event.create({ type, payload });

        // 2. Fetch all registered webhooks
        // In a more complex scenario, this would filter by the user who owns the event or subscribe topics
        let query = {};
        if (webhookIds && Array.isArray(webhookIds) && webhookIds.length > 0) {
            query = { _id: { $in: webhookIds } };
        }
        
        const webhooks = await WebhookEndpoint.find(query);

        // 3. Create delivery attempts for each webhook
        const attempts = webhooks.map(wh => ({
            eventId: event._id,
            webhookId: wh._id,
            status: 'PENDING',
            retryCount: 0,
            nextRetryAt: new Date()
        }));

        if (attempts.length > 0) {
            await DeliveryAttempt.insertMany(attempts);
            
            // Push jobs to BullMQ
            const jobs = attempts.map(attempt => ({
                name: 'deliver-webhook',
                data: {
                    eventId: attempt.eventId,
                    webhookId: attempt.webhookId
                }
            }));
            
            await webhookQueue.addBulk(jobs);
        }

        res.status(201).json({
            message: 'Event created successfully',
            event,
            deliveryAttemptsCreated: attempts.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
