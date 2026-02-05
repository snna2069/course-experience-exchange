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
