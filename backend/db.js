const mongoose = require('mongoose');
const config = require('./config');

// Single source of truth for connecting to MongoDB. Used by server.js at
// startup. Connection failures are fatal and reported clearly; the process
// exits instead of continuing in a broken (disconnected) state.
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`MongoDB connected (${config.MONGODB_URI})`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Stop the app if we cannot connect to the DB
  }
};

// Report connection problems that occur after the initial successful
// connection (e.g. the database becomes unreachable at runtime).
mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

module.exports = connectDB;
