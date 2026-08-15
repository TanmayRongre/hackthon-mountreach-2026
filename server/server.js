const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const { connectDB, getDBStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config(); // fallback to root .env if present

// Connect to Database asynchronously
connectDB();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Dev logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check Route (Includes Server & Database connection state)
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    success: true,
    message: 'Backend server is running smoothly 🚀',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus.stateName,
      connected: dbStatus.connected,
    },
  });
});

// Middleware to check DB connection on database-dependent routes
app.use('/api', (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }
  const dbStatus = getDBStatus();
  if (!dbStatus.connected) {
    // Check if connecting
    if (dbStatus.readyState === 2) {
      return next();
    }
    // Attempt background reconnect
    connectDB();
  }
  next();
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

module.exports = app;
