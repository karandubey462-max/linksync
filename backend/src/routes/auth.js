const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate request body
    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user already exists (email or username)
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    // Create new user (password is hashed automatically by Mongoose pre-save hook)
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });

    if (user) {
      // Seed a couple of default links to help the user get started (as suggested in the implementation plan)
      const Link = require('../models/Link');
      await Link.create([
        {
          userId: user._id,
          title: 'My Personal Website',
          url: 'https://example.com',
          order: 0,
        },
        {
          userId: user._id,
          title: 'Follow me on Twitter',
          url: 'https://twitter.com',
          order: 1,
        }
      ]);

      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          accentColor: user.accentColor,
          selectedTheme: user.selectedTheme,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          accentColor: user.accentColor,
          selectedTheme: user.selectedTheme,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

module.exports = router;
