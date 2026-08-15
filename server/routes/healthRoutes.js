// Health check route — used to verify the server is running
// GET /api/health → { success: true, message: "Server is running", ... }

const express = require('express');
const router = express.Router();
const { getDBStatus } = require('../config/db');

const healthHandler = (req, res) => {
  const dbStatus = getDBStatus ? getDBStatus() : { connected: true };
  res.status(200).json({
    success: true,
    message: 'Backend server is active and running',
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: '1.0.0',
  });
};

router.get('/', healthHandler);
router.get('/health', healthHandler);

module.exports = router;
