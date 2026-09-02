// LEGACY / INACTIVE: not imported or routed anywhere in App.js, and posts to
// GET/POST /api/courses/:id/reviews, which does not exist in the active
// backend. See the note in Review.js for the full explanation. The active
// feedback feature is the Comment flow in CourseDetails.js.

import React, { useState } from "react";
import axios from "axios";

const AddReview = ({ courseId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState({
    relevance: 0,
    difficulty: 0,
    application: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/api/courses/${courseId}/reviews`, {
        review,
        rating,
      })
      .then((response) => {
        alert("Review added successfully!");
        setReview("");
        setRating({ relevance: 0, difficulty: 0, application: 0 });
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here"
      ></textarea>
      <div>
        <label>Relevance: </label>
        <input
          type="number"
          value={rating.relevance}
          onChange={(e) =>
            setRating({ ...rating, relevance: e.target.value })
          }
        />
      </div>
      <div>
        <label>Difficulty: </label>
        <input
          type="number"
          value={rating.difficulty}
          onChange={(e) =>
            setRating({ ...rating, difficulty: e.target.value })
          }
        />
      </div>
      <div>
        <label>Application in Real World: </label>
        <input
          type="number"
          value={rating.application}
          onChange={(e) =>
            setRating({ ...rating, application: e.target.value })
          }
        />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default AddReview;
