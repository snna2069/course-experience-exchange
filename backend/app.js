const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

// NOTE: This module only configures the Express app. It does not connect to
// the database or start the HTTP listener — that is server.js's job (single
// startup entry point: `npm start` -> server.js -> app.listen()).
const app = express();
app.use(cors({ origin: config.FRONTEND_URL }));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Backend of Course Experience Exchange!!');
});

// Health check: reports process liveness and current MongoDB connection
// state without requiring a database round-trip.
const MONGOOSE_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: MONGOOSE_STATES[mongoose.connection.readyState] || 'unknown',
  });
});

module.exports = app;
