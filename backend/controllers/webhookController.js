const WebhookEndpoint = require('../models/WebhookEndpoint');

// @route   POST /api/webhooks
// @desc    Register a new webhook
exports.registerWebhook = async (req, res) => {
    try {
        const { userId, url } = req.body;
        
        if (!userId || !url) {
            return res.status(400).json({ error: 'userId and url are required' });
        }

        const webhook = await WebhookEndpoint.create({ userId, url });
        res.status(201).json(webhook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @route   GET /api/webhooks
// @desc    Get registered webhooks (optionally filtered by userId)
exports.getWebhooks = async (req, res) => {
    try {
        const { userId } = req.query;
        const query = userId ? { userId } : {};
        
        const webhooks = await WebhookEndpoint.find(query);
        res.json(webhooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
