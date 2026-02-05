// frontend/src/components/Review.js

import React, { useState } from 'react';
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
