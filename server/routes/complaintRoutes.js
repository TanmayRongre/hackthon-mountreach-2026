const express = require("express");

const {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint
} = require("../Controllers/complaintController");

const router = express.Router();

// Routes for complaint operations
router.get("/", getComplaints);
router.get("/:id", getComplaintById);
router.post("/", createComplaint);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

module.exports = router;
