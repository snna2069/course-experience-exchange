// LEGACY / INACTIVE: unused PostgreSQL connection pool. The active backend
// (server.js) uses MongoDB via mongoose (see config.js, db.js). Preserved
// for future evaluation.
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = { pool };
