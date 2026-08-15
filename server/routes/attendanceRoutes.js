const express = require("express");
const {
  scanAttendance,
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for attendance operations
router.post("/scan", protect, scanAttendance);
router.get("/", protect, getAttendances);
router.get("/:id", protect, getAttendanceById);
router.post("/", protect, createAttendance);
router.put("/:id", protect, updateAttendance);
router.delete("/:id", protect, deleteAttendance);

module.exports = router;
