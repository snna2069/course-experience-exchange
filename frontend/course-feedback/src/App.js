import React, { useMemo, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Profile from './components/Profile';
import CourseDetails from './components/CourseDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import { courses, departments } from './data/courses';
import './App.css';

const Stars = ({ rating }) => (
  <span className="stars" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => <span key={star} className={star <= Math.round(rating) ? 'star filled' : 'star'}>★</span>)}
  </span>
);

function Home() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const filteredCourses = useMemo(() => courses.filter((course) => {
    const query = search.toLowerCase();
    return (!query || `${course.name} ${course.code} ${course.professor}`.toLowerCase().includes(query))
      && (!department || course.department === department)
      && (!level || course.gradLevel === level);
  }), [search, department, level]);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">THE STUDENT-LED CATALOG</span>
          <h1>Find your next<br /><em>favorite</em> class.</h1>
          <p>Real experiences from students, made searchable. Discover courses that fit how you want to learn.</p>
          <a className="button button-light" href="#catalog">Explore the catalog <span>↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="floating-note note-one">↗  4.9 rated</div>
          <div className="floating-note note-two">✦ student favorite</div>
          <div className="hero-stamp">CEE<span>✳</span></div>
        </div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="section-heading">
          <div><span className="eyebrow">BROWSE THE CATALOG</span><h2>Courses worth talking about.</h2></div>
          <span className="course-count">{filteredCourses.length} of {courses.length} courses</span>
        </div>
        <div className="search-bar">
          <span className="search-icon">⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses, professors, or codes..." />
          <select value={department} onChange={(event) => setDepartment(event.target.value)} aria-label="Filter by department">
            <option value="">All departments</option>
            {departments.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filter by level">
            <option value="">All levels</option><option value="Undergraduate">Undergraduate</option><option value="Graduate">Graduate</option>
          </select>
        </div>
        {filteredCourses.length === 0 ? <div className="empty-state"><span>◌</span><h3>No courses found</h3><p>Try a different search or clear your filters.</p></div> : (
          <div className="course-grid">
            {filteredCourses.map((course) => (
              <Link className="course-card" to={`/courses/${course.id}`} key={course.id}>
                <div className={`card-art ${course.accent}`}><span>{course.code}</span><strong>{course.name.split(' ').map((word) => word[0]).join('')}</strong></div>
                <div className="card-body"><div className="card-meta"><span>{course.department}</span><span>{course.gradLevel}</span></div><h3>{course.name}</h3><p>{course.description}</p><div className="card-footer"><Stars rating={course.rating} /><strong>{course.rating}</strong><span>{course.reviews} reviews</span><span className="arrow">↗</span></div></div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function App() {
  return <><Header /><Routes><Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route path="/signup" element={<Signup />} /><Route path="/profile" element={<Profile />} /><Route path="/courses/:id" element={<CourseDetails />} /><Route path="*" element={<Home />} /></Routes><Footer /></>;
}

export default App;
