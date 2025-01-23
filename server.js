const express = require('express');
const bodyParser = require('body-parser');
const { connectToDatabase } = require('./db');
const mqttClient = require('./mqttClient');
const dataRoutes = require('./routes/data');

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());

// API routes
app.use('/data', dataRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start the server
async function startServer() {
    await connectToDatabase(); // Ensure MongoDB connection is established

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await mqttClient.end(); // Close MQTT connection
    process.exit(0);
});

// Start the server
startServer();