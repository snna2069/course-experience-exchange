const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, enum: [1, -1], required: true },
}, { timestamps: true });

ratingSchema.index({ course: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
