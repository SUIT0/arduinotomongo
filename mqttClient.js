const mqtt = require('mqtt');
const { getCollection } = require('./db');

// MQTT Configuration (HiveMQ Cloud)
const mqttBrokerUrl = 'mqtts://5e8a5c70730045b39264d94c29249d92.s1.eu.hivemq.cloud:8883'; // Update with HiveMQ URL
const mqttOptions = {
    username: 'admin', // Replace with your HiveMQ username
    password: '123456789Abc', // Replace with your HiveMQ password
    reconnectPeriod: 1000 // Reconnect every second if disconnected
};
const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('device/control', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log('Subscribed to topic: device/control');
        }
    });
});

mqttClient.on('message', async (topic, message) => {
    console.log(`Message received on ${topic}: ${message.toString()}`);

    if (topic === 'device/control') {
        const command = JSON.parse(message.toString());
        console.log('Parsed command:', command);
        try {
            const collection = getCollection();
            await collection.updateOne(
                { deviceId: command.deviceId }, // Find the device by ID
                { $set: { state: command.state } }, // Update the state
                { upsert: true } // Insert if not found
            );
            console.log(`Device ${command.deviceId} updated to state: ${command.state}`);
        } catch (err) {
            console.error('Error updating database:', err);
        }
    }
});

mqttClient.on('error', (err) => {
    console.error('MQTT connection error:', err.message);
});

mqttClient.on('offline', () => {
    console.log('MQTT client is offline');
});

mqttClient.on('reconnect', () => {
    console.log('Attempting to reconnect to MQTT broker');
});

module.exports = mqttClient;