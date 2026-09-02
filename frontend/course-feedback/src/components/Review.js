// frontend/src/components/Review.js
//
// LEGACY / INACTIVE: this component is not imported or routed anywhere in
// App.js, so it cannot be reached by users. It also calls
// GET/POST /api/courses/:id/reviews, which does not exist in the active
// backend (backend/app.js only mounts /api/auth and /api/courses; the
// separate Review model/routes in backend/routes/reviews.js are themselves
// unmounted — see Phase 3 legacy markers). The active, working feedback
// feature is the Comment flow used by CourseDetails.js
// (GET/POST /api/courses/:id/comments). Preserved for future evaluation;
// the missing `useEffect` import below is fixed for hygiene only.

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Review({ courseId }) {
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  // Fetch reviews when the component mounts
  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${courseId}/reviews`)
      .then(response => setReviews(response.data))
      .catch(error => console.error('Error fetching reviews', error));
  }, [courseId]);

  const handleSubmitReview = () => {
    const username = 'user1'; // Hardcoded for now, ideally from the login state
    axios.post(`http://localhost:5000/api/courses/${courseId}/reviews`, { username, review: reviewText })
      .then(() => {
        setReviewText('');
        // Refetch reviews after adding a new one
        axios.get(`http://localhost:5000/api/courses/${courseId}/reviews`)
          .then(response => setReviews(response.data));
      })
      .catch(error => console.error('Error submitting review', error));
  };

  return (
    <div>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review, idx) => (
          <li key={idx}>
            <strong>{review.username}:</strong> {review.review}
          </li>
        ))}
      </ul>
      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Write a review" />
      <button onClick={handleSubmitReview}>Submit Review</button>
    </div>
  );
}

export default Review;
