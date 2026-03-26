const mongoose = require('mongoose');

const deliveryAttemptSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
            index: true,
        },
        webhookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WebhookEndpoint',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'SUCCESS', 'FAILED'],
            default: 'PENDING',
            index: true,
        },
        retryCount: {
            type: Number,
            default: 0,
        },
        nextRetryAt: {
            type: Date,
            index: true,
        },
    },
    { timestamps: true }
);

// Compound index for efficiently querying pending deliveries that are scheduled exactly for now or earlier
deliveryAttemptSchema.index({ status: 1, nextRetryAt: 1 });

module.exports = mongoose.model('DeliveryAttempt', deliveryAttemptSchema);
