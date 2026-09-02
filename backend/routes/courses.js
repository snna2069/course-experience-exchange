const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Comment = require('../models/Comment');

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
      .populate('comments')
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
router.get('/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('comments');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course); // Send course details along with comments
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Add a comment to a course
router.post('/:courseId/comments', async (req, res) => {
  const { text, username } = req.body;
  const newComment = new Comment({ text, username });

  try {
    await newComment.save(); // Save the new comment

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.comments.push(newComment); // Add the comment to the course
    await course.save(); // Save the updated course

    res.status(201).json(newComment); // Respond with the new comment
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment' });
  }
});

// New API endpoint for submitting ratings (like/dislike)
router.post('/:courseId/rate', async (req, res) => {
  const { rating } = req.body; // Expected values: 1 (like), -1 (dislike)
  if (rating !== 1 && rating !== -1) {
    return res.status(400).json({ message: 'Invalid rating' });
  }

  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update the course rating (for simplicity, we are storing the latest user rating)
    // You can modify this logic if you need to track multiple user ratings
    course.userRating = rating;

    await course.save(); // Save updated course with rating
    res.json(course); // Return the updated course details
  } catch (error) {
    res.status(500).json({ message: 'Error submitting rating' });
  }
});

module.exports = router;
