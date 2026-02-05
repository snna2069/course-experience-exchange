const express = require('express');
const { addCommentToReview, likeReview } = require('../controllers/reviewController');
const router = express.Router();

router.post('/:courseId/reviews/:reviewId/comment', addCommentToReview);
router.post('/reviews/:reviewId/like', likeReview);

module.exports = router;
