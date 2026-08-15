const express = require("express");

const {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel
} = require("../controllers/hostelController");

const router = express.Router();

// Routes for hostel operations
router.get("/", getHostels);
router.get("/:id", getHostelById);
router.post("/", createHostel);
router.put("/:id", updateHostel);
router.delete("/:id", deleteHostel);

module.exports = router;
