const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const linkRoutes = require('./routes/linkRoutes');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.disable('x-powered-by');

// CORS
app.use(
  cors({
    origin: 'https://daily-link-tracker.vercel.app' || 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));

// Sanitize data against NoSQL injection
app.use(mongoSanitize());

// Rate limiting
app.use(globalLimiter);

// Routes
app.use('/api/links', linkRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});
