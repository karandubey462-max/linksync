require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize express
const app = express();

// Connect to Database
connectDB();

// CORS configuration - allow all origins for dev simplicity, can be locked down later
app.use(cors());

// Body parser middleware with custom size limit (for compressed base64 avatars)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Welcome Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Link-in-Bio Profile Builder API' });
});

// Register Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/links', require('./routes/links'));

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
