const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config');

// Connect to MongoDB
mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    startServer(config.PORT); // Start the server after successful DB connection
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Function to start the server with error handling
function startServer(port) {
  let server;

  try {
    server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Error starting the server:', err);
    return;
  }

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Retrying on port ${port + 1}...`);
      server.close(() => {
        startServer(port + 1); // Try the next port
      });
    } else {
      console.error('Unexpected server error:', err);
    }
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Server closed gracefully');
      process.exit(0);
    });
  });
}
