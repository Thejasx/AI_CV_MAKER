const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aicvmaker';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Connection Warning: ${error.message}`);
    console.warn(`[MongoDB] Operating in flexible mode. Resume generation & export will work smoothly. DB saves will return in-memory responses if MongoDB server is unavailable.`);
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
