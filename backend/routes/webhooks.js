const express = require('express');
const router = express.Router();
const { registerWebhook, getWebhooks } = require('../controllers/webhookController');

router.post('/', registerWebhook);
router.get('/', getWebhooks);

module.exports = router;
