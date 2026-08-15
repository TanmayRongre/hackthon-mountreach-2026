const express = require("express");

const {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} = require("../Controllers/notificationController");

const router = express.Router();

// Routes for notification operations
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.post("/", createNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

module.exports = router;
