const express = require("express");

const {
  getLeaves,
  getLeaveById,
  createLeave,
  updateLeave,
  deleteLeave
} = require("../Controllers/leaveController");

const router = express.Router();

// Routes for leave operations
router.get("/", getLeaves);
router.get("/:id", getLeaveById);
router.post("/", createLeave);
router.put("/:id", updateLeave);
router.delete("/:id", deleteLeave);

module.exports = router;
