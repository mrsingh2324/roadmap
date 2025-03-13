const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Search locations
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    const locations = await Location.find({
      name: { $regex: q, $options: 'i' }
    });

    res.json(locations);
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({ message: 'Failed to search locations' });
  }
});

module.exports = router;
