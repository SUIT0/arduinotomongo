const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url} with body:`, req.body);
    next();
});

// MongoDB connection string
const uri = 'mongodb+srv://balmukunda211306:dVyJ2BfgMNnRG1SV@cluster0.c4bff.mongodb.net/atom';
const client = new MongoClient(uri);
let collection;

// Connect to MongoDB Atlas
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        collection = client.db('atom').collection('gharbeti');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the app if connection fails
    }
}

// Endpoint to save data to MongoDB
async function saveDataToDatabase(data) {
    try {
        await collection.insertOne(data);
        console.log('Data saved to database:', data); // Log the data being saved
    } catch (err) {
        console.error('Error saving data:', err);
        throw err; // Rethrow error to be handled by the caller
    }
}

// Start the server after connecting to MongoDB
async function startServer() {
    await connectToDatabase(); // Ensure the connection is established before proceeding

    // Endpoint to handle incoming data from Arduino
    app.post('/data', async (req, res) => {
        const data = req.body; // Expect JSON data from Arduino
        console.log('Data received:', data); // Log the received data

        try {
            await saveDataToDatabase(data);
            res.status(200).send('Data saved to MongoDB');
        } catch (err) {
            res.status(500).send('Error saving data: ' + err);
        }
    });

    // Start listening for requests
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

// Graceful shutdown for MongoDB connection
process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

// Start the server
startServer();
