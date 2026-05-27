const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Link = require('../models/Link');

// @desc    Get all user links
// @route   GET /api/links
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.id }).sort({ order: 1 });
    res.json({ success: true, links });
  } catch (error) {
    console.error('Get links error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create a new link
// @route   POST /api/links
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Please provide title and URL' });
    }

    // Find the highest order index to append the new link at the end
    const lastLink = await Link.findOne({ userId: req.user.id }).sort({ order: -1 });
    const nextOrder = lastLink ? lastLink.order + 1 : 0;

    const link = await Link.create({
      userId: req.user.id,
      title,
      url,
      active: true,
      clicks: 0,
      order: nextOrder,
    });

    res.status(201).json({ success: true, link });
  } catch (error) {
    console.error('Create link error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @desc    Reset click counts for all links owned by current user
// @route   PATCH /api/links/reset-clicks
// @access  Private
router.patch('/reset-clicks', protect, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.id });

    await Promise.all(
      links.map((link) => {
        link.clicks = 0;
        return link.save();
      })
    );

    res.json({ success: true, message: 'Click stats reset successfully' });
  } catch (error) {
    console.error('Reset clicks error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update a link
// @route   PUT /api/links/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const link = await Link.findById(req.id || req.params.id);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    // Check ownership
    if (link.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { title, url, active, order } = req.body;

    if (title !== undefined) link.title = title;
    if (url !== undefined) link.url = url;
    if (active !== undefined) link.active = active;
    if (order !== undefined) link.order = order;

    const updatedLink = await link.save();
    res.json({ success: true, link: updatedLink });
  } catch (error) {
    console.error('Update link error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @desc    Delete a link
// @route   DELETE /api/links/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    // Check ownership
    if (link.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await link.deleteOne();
    res.json({ success: true, message: 'Link removed successfully' });
  } catch (error) {
    console.error('Delete link error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Increment link click count
// @route   PATCH /api/links/:id/click
// @access  Public (No Auth Required)
router.patch('/:id/click', async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    link.clicks = (link.clicks || 0) + 1;
    await link.save();

    res.json({ success: true, clicks: link.clicks });
  } catch (error) {
    console.error('Click tracking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
