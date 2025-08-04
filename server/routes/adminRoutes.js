const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to verify admin (optional)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

// Get all registered users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
