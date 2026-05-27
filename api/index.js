const path = require('path');

try {
  require('../backend/node_modules/dotenv').config({
    path: path.join(__dirname, '..', 'backend', '.env'),
  });
} catch {
  // Vercel provides environment variables directly; local backend installs provide dotenv.
}

const app = require('../backend/src/app');

module.exports = app;
