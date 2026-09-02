// LEGACY / INACTIVE ENTRY POINT
// This file implements an alternate PostgreSQL + Kafka backend that is NOT
// used by the active application. The canonical backend entry point is
// server.js (started via `npm start`), which uses Express + MongoDB
// (see app.js, routes/, models/). This file is preserved for future
// evaluation but must not be wired into package.json "start" or Docker
// CMD/command entries.
// Importing necessary modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Client } = require('pg');
const kafka = require('kafka-node');
const firebaseAdmin = require('firebase-admin');

// Load environment variables
dotenv.config();

// Log environment variables to check if they're loaded correctly
console.log('Database URL:', process.env.DATABASE_URL);
console.log('Kafka Broker:', process.env.KAFKA_BROKER);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin (for Firebase Authentication)
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: 'https://your-firebase-database.firebaseio.com',
});

// Set up PostgreSQL client (using environment variables)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Connect to PostgreSQL with error handling
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1); // Exit the process if the connection fails
  });

// Kafka client setup with error handling
const kafkaClient = new kafka.KafkaClient({
  kafkaHost: process.env.KAFKA_BROKER,
});

const producer = new kafka.Producer(kafkaClient);

producer.on('ready', () => {
  console.log('Kafka Producer is ready');
});

producer.on('error', (err) => {
  console.error('Error with Kafka producer:', err);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Course Experience Exchange API!');
});

// Example route to get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM courses');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route for posting course reviews
app.post('/api/reviews', async (req, res) => {
  const { course_id, user_id, review } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO reviews(course_id, user_id, review) VALUES($1, $2, $3) RETURNING *',
      [course_id, user_id, review]
    );
    res.status(201).json(result.rows[0]);

    // Kafka producer to notify when a review is added
    const payload = [
      {
        topic: 'courseEvents',
        messages: JSON.stringify({ action: 'review_added', course_id, user_id, review }),
        partition: 0,
      },
    ];

    producer.send(payload, (err, data) => {
      if (err) {
        console.error('Error sending Kafka message:', err);
      } else {
        console.log('Kafka message sent:', data);
      }
    });
  } catch (err) {
    console.error('Error inserting review:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
