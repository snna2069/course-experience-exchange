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

## Installation and Deployment Instructions

### Clone the Repository

```bash
git https://github.com/cu-csci-4253-datacenter-fall-2024/finalproject-final-project-team-117
```

### Setting Up Database:
- Create database: 
    Login to your database user
    CREATE USER courseexperienceexchange WITH PASSWORD 'password'; 
    GRANT ALL PRIVILEGES ON DATABASE postgres TO courseexperienceexchange;
    psql -U courseexperienceexchange -d postgres -f init.sql
    \q

### Dependencies:
- Start Kafka:
    Cd kafka folder that was installed:
        bin\windows\kafka-server-start.bat config\server.properties
- Start Zookeeper:
    Cd kafka folder that was installed:
        bin\windows\zookeeper-server-start.bat config\zookeeper.properties

### Deployment:
- Terminal 1:
    cd finalproject-final-project-team-117/backend folder
    Run the following commands:
        - npm install
        - cd kafka
        - node producer.js
- Terminal 2:
    cd finalproject-final-project-team-117/backend folder
    Run the following commands:
        - npm install
        - cd kafka
        - node consumer.js
- Terminal 3:
    cd finalproject-final-project-team-117/backend folder
    Run the following commands:
        - npm install
        - node server.js
- Terminal 4:
    cd finalproject-final-project-team-117/frontend folder
    Run the following commands:
        - npm install
        - npm start
        
This will bring up the browsers.
Ensure to check the MongoDB Compass to verify any DB related issues.
