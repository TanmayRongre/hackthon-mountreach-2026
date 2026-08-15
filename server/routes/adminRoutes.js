const express = require('express');
const {
  getAdminOverview,
  getAuditLogs,
  getSystemHealth,
  manageUserRole,
  getAdminReports,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes protected and restricted to role 'admin'
router.get('/overview', protect, authorize('admin'), getAdminOverview);
router.get('/audit-logs', protect, authorize('admin'), getAuditLogs);
router.get('/system-health', protect, authorize('admin'), getSystemHealth);
router.put('/users/:id/role', protect, authorize('admin'), manageUserRole);
router.get('/reports', protect, authorize('admin'), getAdminReports);

module.exports = router;
