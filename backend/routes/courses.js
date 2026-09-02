const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const requireAuth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

// Get all courses with optional filters for department and graduation level
router.get('/', async (req, res) => {
  const { department, gradLevel, page = 1, limit = 100 } = req.query; // Add pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 100;

  try {
    const filters = {};
    if (department) filters.department = department;
    if (gradLevel) filters.gradLevel = gradLevel;

    const courses = await Course.find(filters)
      .populate({ path: 'comments', populate: { path: 'user', select: 'name email' } })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum); // Pagination applied

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// New API endpoint for search suggestions
// NOTE: must be declared before '/:courseId' below, otherwise Express would
// match this path as a course ID lookup and never reach this handler.
router.get('/suggestions', async (req, res) => {
  const query = (req.query.q || '').toLowerCase(); // The query parameter for search

  try {
    // Find courses or departments that match the search query
    const suggestions = await Course.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search for course name
        { department: { $regex: query, $options: 'i' } } // Case-insensitive search for department
      ]
    }).limit(10); // Limit to 10 suggestions

    // Send the course names and departments as suggestions
    res.json({
      suggestions: suggestions.map(course => ({
        id: course._id,
        name: course.name,
        department: course.department
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggestions' });
  }
});

// Get a course by ID with its comments
router.get('/:courseId', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate({ path: 'comments', populate: { path: 'user', select: 'name email' } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const userRating = req.user
      ? await Rating.findOne({ course: course._id, user: req.user._id })
      : null;
    res.json({
      ...course.toObject(),
      userRating: userRating ? userRating.value : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Add a comment to a course
router.post('/:courseId/comments', requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newComment = new Comment({ text: text.trim(), user: req.user._id });
    await newComment.save();
    course.comments.push(newComment._id);
    await course.save(); // Save the updated course

    await newComment.populate('user', 'name email');
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment' });
  }
});

// New API endpoint for submitting ratings (like/dislike)
router.post('/:courseId/rate', requireAuth, async (req, res) => {
  const { rating } = req.body; // Expected values: 1 (like), -1 (dislike)
  if (rating !== 1 && rating !== -1) {
    return res.status(400).json({ message: 'Invalid rating' });
  }

  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const previousRating = await Rating.findOne({ course: course._id, user: req.user._id });
    if (previousRating) {
      if (previousRating.value === rating) {
        await Rating.deleteOne({ _id: previousRating._id });
        const countField = rating === 1 ? 'likeCount' : 'dislikeCount';
        course[countField] = Math.max(0, (course[countField] || 0) - 1);
      } else {
        previousRating.value = rating;
        await previousRating.save();
        course.likeCount = Math.max(0, (course.likeCount || 0) + (rating === 1 ? 1 : -1));
        course.dislikeCount = Math.max(0, (course.dislikeCount || 0) + (rating === -1 ? 1 : -1));
      }
    } else {
      await Rating.create({ course: course._id, user: req.user._id, value: rating });
      const countField = rating === 1 ? 'likeCount' : 'dislikeCount';
      course[countField] = (course[countField] || 0) + 1;
    }

    await course.save(); // Save updated course with rating
    const currentRating = await Rating.findOne({ course: course._id, user: req.user._id });
    res.json({ course, userRating: currentRating ? currentRating.value : null });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting rating' });
  }
});

module.exports = router;
