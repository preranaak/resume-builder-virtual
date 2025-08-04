import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import router from './routes/auth.js';
import adminRoutes from './routes/admin.js'; // Admin routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// MongoDB connection with retry
const connectWithRetry = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Attempting MongoDB connection (${retries + 1}/${maxRetries})...`);
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connection failed (${retries + 1}):`, err.message);
      retries++;
      if (retries === maxRetries) process.exit(1);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};
connectWithRetry();

// Resume Schema
const resumeSchema = new mongoose.Schema({
  personalDetails: {
    name: String, email: String, phone: String, location: String,
    linkedin: String, github: String, portfolio: String,
    summary: String, photo: String
  },
  workExperience: [{ company: String, position: String, startDate: String, endDate: String, description: String }],
  education: [{ institution: String, degree: String, field: String, graduationDate: String, gpa: String }],
  projects: [{ name: String, description: String, technologies: String, link: String }],
  skills: {
    technical: { type: String, default: '' },
    soft: { type: String, default: '' }
  },
  certifications: [{ name: String, issuer: String, date: String, link: String }],
  userId: String
});
const Resume = mongoose.model('Resume', resumeSchema);

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ✅ Middleware to authorize admin only
const authorizeAdmin = (req, res, next) => {
  console.log('user role',req.user.role)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// Routes
app.use('/api/auth', router);
app.use('/api/admin', authenticateToken, authorizeAdmin, adminRoutes); // ✅ Protected admin routes

// Resume Save API
app.post('/api/resumes', authenticateToken, async (req, res) => {
  try {
    const existing = await Resume.findOne({ userId: req.user.userId });
    let saved;
    if (existing) {
      saved = await Resume.findOneAndUpdate({ userId: req.user.userId }, { ...req.body }, { new: true });
    } else {
      const resume = new Resume({ ...req.body, userId: req.user.userId });
      saved = await resume.save();
    }
    res.json(saved);
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save resume', details: error.message });
  }
});

// Resume Get API
app.get('/api/resumes', authenticateToken, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId });
    res.json(resumes);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes', details: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
