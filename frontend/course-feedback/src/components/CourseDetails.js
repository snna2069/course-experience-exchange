import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(null); // to track user rating

  useEffect(() => {
    if (!id) {
      setError('Invalid course ID');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/courses/${id}`)
      .then((response) => {
        setCourse(response.data);
        setComments(response.data.comments || []);
        setUserRating(response.data.userRating || null); // set user's rating if available
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load course details.');
        setLoading(false);
      });
  }, [id]);

  const handleCommentSubmit = () => {
    if (newComment) {
      axios
        .post(`http://localhost:5000/api/courses/${id}/comments`, {
          text: newComment,
          username: 'Anonymous',
        })
        .then((response) => {
          setComments((prevComments) => [...prevComments, response.data]);
          setNewComment('');
        })
        .catch(() => {
          setError('Error adding comment.');
        });
    }
  };

  const handleRating = (rating) => {
    // Update user rating when they click like or dislike
    setUserRating(rating);

    axios
      .post(`http://localhost:5000/api/courses/${id}/rate`, { rating })
      .then((response) => {
        setCourse(response.data); // Update the course details after rating
      })
      .catch(() => {
        setError('Error submitting rating.');
      });
  };

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p>{error}</p>;
  if (!course) return <p>Course not found or data unavailable.</p>;

  return (
    <div className="course-details">
      <h2>{course.name}</h2>
      <p>{course.description}</p>
      <div className="course-meta">
        <p>
          <strong>Department:</strong> {course.department}
        </p>
        <p>
          <strong>Graduation Level:</strong> {course.gradLevel}
        </p>
        <div className="rating">
          <strong>Rating:</strong>{' '}
          <span className="stars">
            {course.rating && Number.isFinite(course.rating)
              ? Array(Math.round(course.rating))
                  .fill('⭐')
                  .join('')
              : 'No rating available'}
          </span>
          {course.rating && Number.isFinite(course.rating) && ` (${course.rating.toFixed(1)})`}
        </div>
        <div className="like-buttons">
          <button
            className={userRating === 1 ? 'liked' : ''}
            onClick={() => handleRating(1)}
            title="Like"
          >
            👍
          </button>
          <button
            className={userRating === -1 ? 'disliked' : ''}
            onClick={() => handleRating(-1)}
            title="Dislike"
          >
            👎
          </button>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment._id} className="comment">
                <strong>{comment.username}</strong>: {comment.text}
              </li>
            ))}
          </ul>
        )}
        <div className="comment-input">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleCommentSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
