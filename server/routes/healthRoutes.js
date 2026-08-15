const express = require('express');
const router = express.Router();
const { getDBStatus } = require('../config/db');
const { getKeepAliveStatus } = require('../utils/keepAlive');

const healthHandler = (req, res) => {
  const dbStatus = getDBStatus ? getDBStatus() : { connected: true };
  const keepAlive = getKeepAliveStatus ? getKeepAliveStatus() : null;

  res.status(200).json({
    success: true,
    message: 'Backend server is active and running',
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    keepAlive,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
};

router.get('/', healthHandler);
router.get('/health', healthHandler);

module.exports = router;

