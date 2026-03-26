const DeliveryAttempt = require('../models/DeliveryAttempt');

// @route   GET /api/deliveries
// @desc    Get all webhook deliveries (filterable by status)
exports.getDeliveries = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        
        if (status) {
            filter.status = status.toUpperCase(); // Ensure consistency with PENDING, SUCCESS, FAILED
        }

        const deliveries = await DeliveryAttempt.find(filter)
            .populate('webhookId', 'url') // Fetch the URL from WebhookEndpoint
            .select('eventId webhookId status retryCount') // Restrict returned fields
            .lean(); // For faster read performance

        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
