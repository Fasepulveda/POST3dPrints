const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');
const auth = require('../middleware/auth');

// Get all reels
router.get('/', async (req, res) => {
  try {
    const reels = await Reel.find().sort('-createdAt');
    res.json(reels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create reel - requires authentication
router.post('/', [auth], async (req, res) => {
  try {
    const { title, description, videoUrl, tags } = req.body;

    const reel = new Reel({
      user: req.user.id,
      title,
      description,
      videoUrl,
      tags
    });

    await reel.save();
    res.json(reel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single reel
router.get('/:id', async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ msg: 'Reel not found' });
    }
    res.json(reel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update reel - requires authentication
router.put('/:id', [auth], async (req, res) => {
  try {
    const { title, description, videoUrl, tags } = req.body;

    // Get reel from database
    let reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ msg: 'Reel not found' });
    }

    // Make sure user owns the reel
    if (reel.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update reel
    reel = await Reel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        videoUrl,
        tags
      },
      { new: true }
    );

    res.json(reel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
