const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize workers
require('./workers/deliveryWorker');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route to check if server is running
app.get('/', (req, res) => {
    res.json({ message: 'Webhook delivery platform API is running' });
});

// Define API routes
app.use('/api/webhooks', require('./routes/webhooks'));
app.use('/api/events', require('./routes/events'));
app.use('/api/deliveries', require('./routes/deliveries'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
