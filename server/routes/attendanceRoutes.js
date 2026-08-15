const express = require("express");

const {
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require("../controllers/attendanceController");

const router = express.Router();

// Routes for attendance operations
router.get("/", getAttendances);
router.get("/:id", getAttendanceById);
router.post("/", createAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

module.exports = router;
