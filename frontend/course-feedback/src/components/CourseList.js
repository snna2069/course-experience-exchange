import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ department: '', gradLevel: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    fetch(`/api/courses?${query}&page=${currentPage}&limit=10`)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data.courses);
        setTotalCourses(data.totalCourses);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load courses.');
        setLoading(false);
      });
  }, [filters, currentPage]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Fetch suggestions based on search query (can be an API request or a local filter)
    if (query) {
      fetch(`/api/courses/suggestions?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data.suggestions);
        })
        .catch(() => {
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchSelect = (suggestion) => {
    setSearchQuery(suggestion.name || suggestion.department);
    setSuggestions([]); // Hide suggestions after selection
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <h1>Courses</h1>
      
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for courses or departments..."
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSearchSelect(suggestion)}
                className="suggestion-item"
              >
                {suggestion.name || suggestion.department}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>
          Department:
          <select name="department" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="CS">CS</option>
            <option value="IT">IT</option>
            <option value="AI">AI</option>
          </select>
        </label>
        <label>
          Graduation Level:
          <select name="gradLevel" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
          </select>
        </label>
      </div>

      <div className="course-list-container">
        {courses.length === 0 ? (
          <p>No courses to display</p>
        ) : (
          <ul>
            {courses.map((course) => (
              <li key={course._id} className="course-item">
                <Link to={`/courses/${course._id}`}>
                  <h2>
                    {course.name}
                    {course.rating > 4.8 && (
                      <span className="top-rated-badge">
                        <span className="star-icon">★</span> Top Rated
                      </span>
                    )}
                  </h2>
                </Link>
                <p>{course.description}</p>
                <div className="course-rating">
                  {[...Array(5)].map((_, i) => {
                    // Ensure that rating is a valid number between 0 and 5
                    const rating = course.rating && !isNaN(course.rating) ? course.rating : 0;
                    return (
                      <span
                        key={i}
                        className={i < Math.round(rating) ? 'filled' : 'empty'}
                      >
                        ★
                      </span>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseList;
