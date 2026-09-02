-- LEGACY / INACTIVE: this PostgreSQL schema supports the alternate
-- backend/index.js implementation, which is not part of the canonical
-- application path. The active backend (server.js) uses MongoDB models
-- defined in backend/models/. Preserved for future evaluation.
SET search_path TO public;

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    instructor VARCHAR(255)
);

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    feedback_text TEXT,
    rating INTEGER
);
