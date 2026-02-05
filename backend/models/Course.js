const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: false },
  rating: { type: Number, required: false },
  gradLevel: { type: String, required: false },
  userRating: { type: Number, default: 0 }, // To store the like/dislike rating
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Course', courseSchema);
