import React, { createContext, useContext, useMemo, useState } from 'react';
import { courses as seedCourses, PREVIEW_IDS } from '../data/courses';

const CourseContext = createContext();
export const useCourses = () => useContext(CourseContext);

const STORAGE_KEY = 'showcaseCourses';

const readStored = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
};

const withStats = (course) => {
  const total = course.comments.reduce((sum, note) => sum + note.rating, 0);
  return {
    ...course,
    reviews: course.comments.length,
    rating: course.comments.length ? Math.round((total / course.comments.length) * 10) / 10 : 0,
  };
};

export const CourseProvider = ({ children }) => {
  // Seeded catalog plus anything the visitor adds during the session.
  const [added, setAdded] = useState(readStored);

  const persist = (next) => {
    setAdded(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  };

  const addCourse = (draft) => {
    const id = `${draft.code}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const course = { ...draft, id, comments: [], userAdded: true };
    persist([...added.filter((item) => item.id !== id), course]);
    return id;
  };

  const addComment = (courseId, note) => {
    const existing = added.find((item) => item.id === courseId);
    if (existing) {
      persist(added.map((item) => (item.id === courseId ? { ...item, comments: [...item.comments, note] } : item)));
      return;
    }
    const seed = seedCourses.find((item) => item.id === courseId);
    if (!seed) return;
    persist([...added, { ...seed, comments: [...seed.comments, note] }]);
  };

  const courses = useMemo(() => {
    const overrides = new Map(added.map((item) => [item.id, item]));
    const merged = seedCourses.map((course) => overrides.get(course.id) || course);
    const extras = added.filter((item) => !seedCourses.some((course) => course.id === item.id));
    return [...merged, ...extras].map(withStats);
  }, [added]);

  // User-added courses are always visible to their author, alongside the public preview.
  const previewCourses = useMemo(
    () => courses.filter((course) => PREVIEW_IDS.includes(course.id) || course.userAdded),
    [courses],
  );

  const getCourse = (id) => courses.find((course) => course.id === id);

  return (
    <CourseContext.Provider value={{ courses, previewCourses, addCourse, addComment, getCourse }}>
      {children}
    </CourseContext.Provider>
  );
};
