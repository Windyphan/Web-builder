import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import your existing routes and database (now with relative paths from server/api/)
import { initDatabase } from '../config/database.js';
import blogRoutes from '../routes/blogRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import sitemapRoutes from '../routes/sitemapRoutes.js';

dotenv.config();

const app = express();

// Rate limiting - more restrictive for serverless
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs (lower for serverless)
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allow cross-origin requests
}));

app.use(cors({
  origin: [
    'https://www.theinnovationcurve.com',
    'https://theinnovationcurve.com',
    'https://web-builder-five-rust.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Add explicit preflight handling
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database at module level (outside request handling)
let dbInitialized = false;
let dbInitPromise = null;

const initDB = async () => {
  if (!dbInitialized && !dbInitPromise) {
    dbInitPromise = initDatabase().then(() => {
      dbInitialized = true;
      dbInitPromise = null;
    });
  }
  if (dbInitPromise) {
    await dbInitPromise;
  }
};

// Initialize database immediately when module loads
initDB().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/', sitemapRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    dbInitialized: dbInitialized
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'The Innovation Curve Blog API - Optimized!',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      blog: '/api/blog',
      sitemap: '/sitemap.xml'
    },
    status: 'serverless function optimized for performance',
    dbReady: dbInitialized
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// Export for Vercel serverless - THIS IS CRITICAL
export default app;
