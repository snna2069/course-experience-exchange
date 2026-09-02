# COURSE EXPERIENCE EXCHANGE

## Project Description

The "Course Experience Exchange" is a comprehensive, web-based platform aimed at helping students make well-informed decisions regarding their academic courses. By enabling the sharing of detailed reviews, rating and feedback, the platform seeks to improve the educational experience for students and foster a culture of continuous improvement in academia.

------------------------------------------------------------------------------------------------------------------

## Features

- **User Authentication**: Secure login and user session management.  
- **Course Feedbacks**: Choose the courses and find reviews on them.  
- **Filter Events**: Filter the courses based on department and grad levels.  
- **Rate the couses**: Rate the courses by liking or disliking it

------------------------------------------------------------------------------------------------------------------

## Tech Stack

  
- **Frontend**: React.js; HTML, CSS, JavaScript
- **Backend**: Node.js with Express.js
- **Database**: Cloud SQL (PostgreSQL)
- **Database Management**: MongoDB
- **Message Queue**: Apache Kafka
- **Authentication**: Firebase Authentication
- **Version Control**: Git and GitHub

------------------------------------------------------------------------------------------------------------------

## Prerequisites

1. **Have the following pre-installed**: Add all of them to environment variables.
   - React
   - node.js
   - PostgreSQL
   - MongoDB/Mongosh
   - MongoDB Compass
   - Apache Kafka
   - gradle

3. **Git** for version control.  

------------------------------------------------------------------------------------------------------------------

## Current Canonical Architecture (Phase 2)

The active, working application path is:

```
React frontend (frontend/course-feedback)
        |
        | REST API (http://localhost:5000)
        v
Express backend (backend/server.js -> backend/app.js)
        |
        v
MongoDB (mongodb://localhost:27017/courseexperienceexchange)
```

PostgreSQL, Kafka, and Firebase Authentication code also exist in this
repository but are **not** part of the active path. They are preserved for
future evaluation and are marked as legacy/inactive in the source files
(`backend/index.js`, `backend/kafka/`, `kafka/`, `backend/models/database.js`,
`backend/controllers/authController.js`, `backend/routes/reviews.js`,
`database/init.sql`). Do not start them as part of normal setup.

------------------------------------------------------------------------------------------------------------------

## Installation and Deployment Instructions

### Clone the Repository

```bash
git clone https://github.com/snna2069/course-experience-exchange.git
```

### Prerequisites for the canonical path

- Node.js
- MongoDB running locally on the default port (27017)

### Backend Setup

```bash
cd course-experience-exchange/backend
npm install
npm start
```

This runs `server.js`, which connects to MongoDB and starts the Express
API on `http://localhost:5000`.

### Frontend Setup

```bash
cd course-experience-exchange/frontend/course-feedback
npm install
npm start
```

This starts the React development server on `http://localhost:3000`.

Note: `frontend/course-feedback` is the only frontend package that runs the
application. The `frontend/package.json` at the repository root is not a
runnable application (no source files) and should be ignored until it is
evaluated for removal.

### Optional / Not Required for the Canonical Path

The following are not required to run the application and are not
currently wired into the active backend:

- PostgreSQL (`database/init.sql`, `backend/index.js`)
- Kafka/Zookeeper (`kafka/`, `backend/kafka/`)
- Firebase Authentication (`backend/firebaseAdmin.js`, `backend/controllers/authController.js`)

