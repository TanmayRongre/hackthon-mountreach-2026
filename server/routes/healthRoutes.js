// Health check route — used to verify the server is running
// GET /api/health → { success: true, message: "Server is running" }

const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp:new Date().toISOString(),
  });
});

module.exports = router;
