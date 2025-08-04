import express from 'express';
import User from '../models/User.js';
// import { isAdmin } from '../auth.js';

const router = express.Router();

// Route: GET /api/admin/users
router.get('/users', async (req, res) => {
  console.log('GET /api/admin/users request received');
  try {
    // Disable caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    const users = await User.find({}, 'email name role _id').sort({ email: 1 });
    console.log(`Found ${users.length} users:`, users);
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;
