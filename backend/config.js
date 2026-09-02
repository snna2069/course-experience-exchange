const path = require('path');

// Load backend/.env regardless of the process's current working directory.
// The .env file itself is optional in production (real deployments should
// set real environment variables directly), so a missing file is not an
// error here — only missing/invalid required values are.
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

function parsePort(value, fallback) {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    if (value !== undefined) {
      console.warn(`Invalid PORT "${value}", falling back to ${fallback}`);
    }
    return fallback;
  }
  return parsed;
}

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/courseexperienceexchange';

if (!MONGODB_URI) {
  // Only reachable if MONGODB_URI is explicitly set to an empty string.
  throw new Error(
    'Missing required environment variable: MONGODB_URI. ' +
      'Copy backend/.env.example to backend/.env and set MONGODB_URI.'
  );
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parsePort(process.env.PORT, 5000),
  MONGODB_URI,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  // Reserved for future JWT-based authentication; not yet used by the
  // active /api/auth routes.
  JWT_SECRET: process.env.JWT_SECRET || null,
};