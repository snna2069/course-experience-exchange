import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { isPreviewCourse } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const { getCourse, addComment } = useCourses();
  const course = getCourse(id);
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [vote, setVote] = useState(null);
  if (!course) return <main className="not-found"><h1>Course not found</h1><Link to="/">Back to catalog</Link></main>;

  // Courses beyond the public preview require signing in, matching the catalog.
  const isLocked = !user && !isPreviewCourse(course) && !course.userAdded;
  if (isLocked) return <main className="not-found"><h1>Sign in to view this course</h1><p>This course is part of the full catalog. Sign in to read its details and student notes.</p><Link className="button" to="/login">Sign in ↗</Link><Link to="/">Back to catalog</Link></main>;

  const comments = course.comments;
  // Derived from the notes on the page rather than an invented statistic.
  const recommendBase = comments.filter((note) => note.rating >= 4).length;
  const recommended = vote === 1 ? recommendBase + 1 : recommendBase;
  const voterCount = vote ? comments.length + 1 : comments.length;
  const recommendPct = voterCount ? Math.round((recommended / voterCount) * 100) : null;

  const submitComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    addComment(course.id, {
      id: Date.now(),
      author: user?.name || 'You',
      role: `${course.department} · ${new Date().getFullYear()}`,
      text: comment.trim(),
      date: 'just now',
      rating,
    });
    setComment('');
    setRating(5);
  };

  return <main className="details-page">
    <Link className="back-link" to="/">← Back to catalog</Link>
    <section className={`details-hero ${course.accent}`}><div><span className="eyebrow">{course.code} · {course.department}</span><h1>{course.name}</h1><p>{course.description}</p></div><div className="details-initials">{course.name.split(' ').map((word) => word[0]).join('')}</div></section>
    <div className="details-layout">
      <article>
        <div className="detail-stats"><div><span>Rating</span><strong>{course.reviews ? <>{course.rating.toFixed(1)} <small>★</small></> : '—'}</strong><em>{course.reviews === 1 ? '1 student review' : `${course.reviews} student reviews`}</em></div><div><span>Format</span><strong>{course.format}</strong><em>{course.duration}</em></div><div><span>Instructor</span><strong>{course.professor}</strong><em>Course lead</em></div></div>
        <div className="detail-section"><span className="eyebrow">WHAT YOU'LL EXPLORE</span><h2>A course with room to grow.</h2><ul className="highlights">{course.highlights.map((item) => <li key={item}>✦ {item}</li>)}</ul></div>
        <div className="detail-section feedback"><div className="feedback-heading"><div><span className="eyebrow">FROM THE COMMUNITY</span><h2>Student notes.</h2></div><span>{comments.length === 1 ? '1 review' : `${comments.length} reviews`}</span></div>
          {comments.length === 0 && <p className="comments-empty">No student notes yet. Be the first to share one.</p>}
          {comments.map((item) => <div className="comment-card" key={item.id}><div className="avatar" aria-hidden="true">{item.author.split(' ').map((word) => word[0]).join('')}</div><div><div className="comment-top"><strong>{item.author}</strong><span>{item.date}</span></div><small>{item.role}</small><div className="comment-stars" aria-label={`${item.rating} out of 5 stars`}><span aria-hidden="true">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span> {item.rating}.0</div><p>{item.text}</p></div></div>)}
          <form className="comment-form" onSubmit={submitComment}>
            <select className="rating-select" value={rating} onChange={(event) => setRating(Number(event.target.value))} disabled={!user} aria-label="Your rating">
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{'★'.repeat(value)} {value}.0</option>)}
            </select>
            <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder={user ? 'Share your experience...' : 'Log in to share your experience'} disabled={!user} />
            <button type="submit" disabled={!user}>Post note ↗</button>
          </form>
        </div>
      </article>
      <aside className="vote-panel"><span className="eyebrow">WORTH YOUR TIME?</span><h3>Would you recommend this course?</h3><p>Your anonymous vote helps other students find a better fit.</p><div className="vote-buttons"><button className={vote === 1 ? 'selected yes' : ''} onClick={() => setVote(vote === 1 ? null : 1)}>↑ <span>Yes</span></button><button className={vote === -1 ? 'selected no' : ''} onClick={() => setVote(vote === -1 ? null : -1)}>↓ <span>Not sure</span></button></div><div className="vote-total"><strong>{recommendPct === null ? '—' : `${recommendPct}%`}</strong><span>{voterCount ? `of ${voterCount} ${voterCount === 1 ? 'student' : 'students'} would recommend it` : 'No recommendations yet'}</span></div></aside>
    </div>
  </main>;
};
export default CourseDetails;
