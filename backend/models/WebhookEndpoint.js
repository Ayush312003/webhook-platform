const mongoose = require('mongoose');

const webhookEndpointSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        url: {
            type: String,
            required: true,
            match: [/^https?:\/\//, 'Please provide a valid URL'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('WebhookEndpoint', webhookEndpointSchema);
