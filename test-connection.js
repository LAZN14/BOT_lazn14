const { connectDB } = require('./db');

async function testConnection() {
    try {
        await connectDB();
        console.log('Successfully connected to database!');
    } catch (err) {
        console.error('Connection test failed:', err);
    }
}

testConnection(); 