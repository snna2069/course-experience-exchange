// LEGACY / INACTIVE: only used by routes/reviews.js, which is not mounted
// by app.js. Preserved for future evaluation.
const Review = require('../models/Review');
const Comment = require('../models/Comment');

exports.addCommentToReview = async (req, res) => {
  const { reviewId, courseId } = req.params;
  const { comment } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).send('Review not found');
    
    const newComment = new Comment({ text: comment, review: reviewId });
    await newComment.save();

    review.comments.push(newComment._id);
    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).send('Error adding comment');
  }
};

exports.likeReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).send('Review not found');

    review.likes += 1;
    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).send('Error liking review');
  }
};
