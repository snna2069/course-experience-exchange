const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection (adjust with your database URL)
mongoose.connect('mongodb://localhost:27017/courseexperienceexchange', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Backend of Course Experience Exchange!!');
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000/');
});

module.exports = app;
