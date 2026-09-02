// LEGACY / INACTIVE: this router is not mounted by app.js, so these
// endpoints are not reachable. Preserved for future evaluation of a
// separate review feature.
const express = require('express');
const router = express.Router();

router.post('/:courseId/reviews/:reviewId/comment', addCommentToReview);
router.post('/reviews/:reviewId/like', likeReview);

module.exports = router;
