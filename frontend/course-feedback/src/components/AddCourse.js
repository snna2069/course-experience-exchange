import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { departments } from '../data/courses';
import './AddCourse.css';

const accents = ['violet', 'coral', 'teal', 'gold', 'sky', 'blush', 'sand', 'lime'];

const emptyDraft = {
  name: '',
  code: '',
  department: departments[0],
  gradLevel: 'Undergraduate',
  professor: '',
  format: 'In person',
  duration: '12 weeks',
  description: '',
  highlights: '',
};

const AddCourse = () => {
  const { addCourse, getCourse } = useCourses();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState('');

  const update = (field) => (event) => setDraft({ ...draft, [field]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    const required = ['name', 'code', 'professor', 'description'];
    if (required.some((field) => !draft[field].trim())) {
      setError('Please fill in the course name, code, instructor, and description.');
      return;
    }
    const id = `${draft.code}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (getCourse(id)) {
      setError(`A course with the code ${draft.code} already exists in the catalog.`);
      return;
    }
    const highlights = draft.highlights.split(',').map((item) => item.trim()).filter(Boolean);
    const newId = addCourse({
      ...draft,
      name: draft.name.trim(),
      code: draft.code.trim(),
      professor: draft.professor.trim(),
      description: draft.description.trim(),
      highlights: highlights.length ? highlights : ['Course overview'],
      accent: accents[Math.floor(Math.random() * accents.length)],
    });
    navigate(`/courses/${newId}`);
  };

  return (
    <main className="add-course-page">
      <Link className="back-link" to="/">← Back to catalog</Link>
      <header className="add-course-head">
        <span className="eyebrow">ADD TO THE CATALOG</span>
        <h1>Share a course.</h1>
        <p>Add a class that is missing from the catalog, then be the first to write a review for it.</p>
      </header>

      <form className="add-course-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field span-2">
            <span>Course name</span>
            <input value={draft.name} onChange={update('name')} placeholder="Distributed Systems" />
          </label>
          <label className="field">
            <span>Course code</span>
            <input value={draft.code} onChange={update('code')} placeholder="CS 512" />
          </label>
          <label className="field">
            <span>Instructor</span>
            <input value={draft.professor} onChange={update('professor')} placeholder="Dr. Ada Lovelace" />
          </label>
          <label className="field">
            <span>Department</span>
            <select value={draft.department} onChange={update('department')}>
              {departments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Level</span>
            <select value={draft.gradLevel} onChange={update('gradLevel')}>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
            </select>
          </label>
          <label className="field">
            <span>Format</span>
            <select value={draft.format} onChange={update('format')}>
              <option value="In person">In person</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Online">Online</option>
              <option value="Studio">Studio</option>
            </select>
          </label>
          <label className="field">
            <span>Duration</span>
            <input value={draft.duration} onChange={update('duration')} placeholder="12 weeks" />
          </label>
          <label className="field span-2">
            <span>Description</span>
            <textarea rows="3" value={draft.description} onChange={update('description')} placeholder="What is this course actually about?" />
          </label>
          <label className="field span-2">
            <span>Highlights <small>comma separated</small></span>
            <input value={draft.highlights} onChange={update('highlights')} placeholder="Consensus algorithms, Fault tolerance, Final project" />
          </label>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button className="button" type="submit">Add course & review it ↗</button>
          <Link className="text-link" to="/">Cancel</Link>
        </div>
      </form>
    </main>
  );
};

export default AddCourse;
