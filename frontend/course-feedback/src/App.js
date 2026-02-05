import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Profile from './components/Profile';
import Welcome from './components/Welcome';
import CourseDetails from './components/CourseDetails';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider } from './context/AuthContext';
//import ReactDOM from 'react-dom';

import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);


function App() {
  const [courses, setCourses] = useState([]);
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState({ department: '', level: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const filteredCourses = courses.filter(course => {
    return (
      (filter.department === '' || course.department === filter.department) &&
      (filter.level === '' || course.level === filter.level)
    );
  });

  return (
    <>
      <Header />

      {user && (
        <div className="logout-container">
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      )}

      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <>
                <h1>Available Courses</h1>
                <div className="filters">
                  <select onChange={(e) => setFilter({ ...filter, department: e.target.value })}>
                    <option value="">All Departments</option>
                    <option value="CS">Computer Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="AI">Artificial Intelligence</option>
                    <option value="Business">Business</option>
                    <option value="ECE">Electronics</option>
                  </select>

                  <select onChange={(e) => setFilter({ ...filter, gradLevel: e.target.value })}>
                    <option value="">All Levels</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                {courses.length === 0 ? (
                  <p>No courses available. Check back later!</p>
                ) : (
                  <ul>
                    {filteredCourses.map(course => (
                      <li key={course._id}>
                        <Link to={`/courses/${course._id}`}>{course.name}</Link>
                        <div className="course-rating">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < course.rating ? 'filled' : 'empty'}>★</span>
                          ))}
                        </div>
                        <div className="course-tags">
                          {course.rating > 4.8 && <span className="badge top-rated">Top Rated</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
        </Routes>
      </div>
    </>
  );
}

//ReactDOM.render(
//  <AuthProvider>
//    <App />
//  </AuthProvider>,
//  document.getElementById('root')
//);

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
export default App;
