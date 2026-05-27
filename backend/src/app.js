// Transparently intercept mongoose imports if MONGODB_URI is empty or holds a placeholder.
// This loads a local file-backed database for development and demo environments.
const mongoUri = process.env.MONGODB_URI;
const shouldUseMockDb =
  !mongoUri ||
  mongoUri.trim() === '' ||
  mongoUri.includes('<username>') ||
  mongoUri.includes('xxxxx') ||
  mongoUri.includes('your_') ||
  mongoUri.includes('replace');

if (shouldUseMockDb) {
  const Module = require('module');
  const originalRequire = Module.prototype.require;
  const mockMongoose = require('./config/mongoose-mock');
  Module.prototype.require = function (id) {
    if (id === 'mongoose') {
      return mockMongoose;
    }
    return originalRequire.apply(this, arguments);
  };
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to the LinkSync API' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/links', require('./routes/links'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
