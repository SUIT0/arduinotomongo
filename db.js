const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb+srv://balmukunda211306:dVyJ2BfgMNnRG1SV@cluster0.c4bff.mongodb.net/atom';
const client = new MongoClient(uri);
let collection;

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

function getCollection() {
    if (!collection) {
        throw new Error('MongoDB connection not established.');
    }
    return collection;
}

module.exports = { connectToDatabase, getCollection };