const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb+srv://subhranil310hitcsecs2020:ni9tFiDhrnPa4kVl@cluster0.1tksnr4.mongodb.net/'); // Replace with your MongoDB URI
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if connection fails
  }
};

module.exports = connectToMongo;