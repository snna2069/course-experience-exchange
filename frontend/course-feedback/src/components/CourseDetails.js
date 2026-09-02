import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourseById } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const course = getCourseById(id);
  const { user } = useAuth();
  const [comments, setComments] = useState(course?.comments || []);
  const [comment, setComment] = useState('');
  const [vote, setVote] = useState(null);
  if (!course) return <main className="not-found"><h1>Course not found</h1><Link to="/">Back to catalog</Link></main>;

  const submitComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { id: Date.now(), author: user?.name || 'You', role: 'Student', text: comment.trim(), date: 'just now', rating: 5 }]);
    setComment('');
  };

  return <main className="details-page">
    <Link className="back-link" to="/">← Back to catalog</Link>
    <section className={`details-hero ${course.accent}`}><div><span className="eyebrow">{course.code} · {course.department}</span><h1>{course.name}</h1><p>{course.description}</p></div><div className="details-initials">{course.name.split(' ').map((word) => word[0]).join('')}</div></section>
    <div className="details-layout">
      <article>
        <div className="detail-stats"><div><span>Rating</span><strong>{course.rating} <small>★</small></strong><em>{course.reviews} student reviews</em></div><div><span>Format</span><strong>{course.format}</strong><em>{course.duration}</em></div><div><span>Instructor</span><strong>{course.professor}</strong><em>Course lead</em></div></div>
        <div className="detail-section"><span className="eyebrow">WHAT YOU'LL EXPLORE</span><h2>A course with room to grow.</h2><ul className="highlights">{course.highlights.map((item) => <li key={item}>✦ {item}</li>)}</ul></div>
        <div className="detail-section feedback"><div className="feedback-heading"><div><span className="eyebrow">FROM THE COMMUNITY</span><h2>Student notes.</h2></div><span>{comments.length} reviews</span></div>
          {comments.length === 0 && <p className="comments-empty">No student notes yet. Be the first to share one.</p>}
          {comments.map((item) => <div className="comment-card" key={item.id}><div className="avatar" aria-hidden="true">{item.author.split(' ').map((word) => word[0]).join('')}</div><div><div className="comment-top"><strong>{item.author}</strong><span>{item.date}</span></div><small>{item.role}</small><div className="comment-stars" aria-label={`${item.rating} out of 5 stars`}><span aria-hidden="true">★★★★★</span> {item.rating}.0</div><p>{item.text}</p></div></div>)}
          <form className="comment-form" onSubmit={submitComment}><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder={user ? 'Share your experience...' : 'Log in to share your experience'} disabled={!user} /><button type="submit" disabled={!user}>Post note ↗</button></form>
        </div>
      </article>
      <aside className="vote-panel"><span className="eyebrow">WORTH YOUR TIME?</span><h3>Would you recommend this course?</h3><p>Your anonymous vote helps other students find a better fit.</p><div className="vote-buttons"><button className={vote === 1 ? 'selected yes' : ''} onClick={() => setVote(vote === 1 ? null : 1)}>↑ <span>Yes</span></button><button className={vote === -1 ? 'selected no' : ''} onClick={() => setVote(vote === -1 ? null : -1)}>↓ <span>Not sure</span></button></div><div className="vote-total"><strong>92%</strong><span>of students would recommend it</span></div></aside>
    </div>
  </main>;
};
export default CourseDetails;
