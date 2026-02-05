const Course = require('../models/Course');
const Comment = require('../models/Comment');

exports.getAllCourses = async (req, res) => {
  const { department, gradLevel } = req.query;

  try {
    const filters = {};
    if (department) filters.department = department;
    if (gradLevel) filters.gradLevel = gradLevel;

    const courses = await Course.find(filters).populate('comments');
    res.json(courses);
  } catch (err) {
    res.status(500).send('Error fetching courses');
  }
};

exports.getCourseById = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate('comments');
    if (!course) return res.status(404).send('Course not found');
    res.json(course);
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).send('Error fetching course details');
  }
};


exports.addCommentToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { text, username } = req.body; // Get comment details

  try {
    const newComment = new Comment({ text, username });

    await newComment.save(); // Save comment

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).send('Course not found');

    course.comments.push(newComment);
    await course.save(); // Save the updated course with new comment

    res.status(201).json(newComment); // Respond with the new comment
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment' });
  }
};
