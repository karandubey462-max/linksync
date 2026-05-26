const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Link = require('../models/Link');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
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
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, bio, avatar, accentColor, selectedTheme, username } = req.body;

    // Optional: allow username change but check for uniqueness
    if (username && username.toLowerCase() !== user.username) {
      const usernameExists = await User.findOne({ username: username.toLowerCase() });
      if (usernameExists) {
        return res.status(400).json({ success: false, message: 'Username is already taken' });
      }
      user.username = username.toLowerCase();
    }

    // Update fields if provided in request body
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar; // base64 payload
    if (accentColor) user.accentColor = accentColor;
    if (selectedTheme) user.selectedTheme = selectedTheme;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        accentColor: updatedUser.accentColor,
        selectedTheme: updatedUser.selectedTheme,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @desc    Get public profile data by username
// @route   GET /api/profile/public/:username
// @access  Public
router.get('/public/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).select('-password -email -createdAt -updatedAt -__v');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Get active links for this user, sorted by 'order' ascending
    const links = await Link.find({ userId: user._id, active: true }).sort({ order: 1 });

    res.json({
      success: true,
      profile: {
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        accentColor: user.accentColor,
        selectedTheme: user.selectedTheme,
      },
      links,
    });
  } catch (error) {
    console.error('Public profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
