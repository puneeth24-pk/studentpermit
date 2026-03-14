require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
    console.log('Connecting to MongoDB using URI:', process.env.MONGODB_URI ? 'URI exists' : 'URI MISSING');

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB Atlas!');

        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

testConnection();
