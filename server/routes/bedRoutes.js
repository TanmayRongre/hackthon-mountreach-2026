const express = require("express");

const {
  getBeds,
  getBedById,
  createBed,
  updateBed,
  deleteBed
} = require("../Controllers/bedController");

const router = express.Router();

// Routes for bed operations
router.get("/", getBeds);
router.get("/:id", getBedById);
router.post("/", createBed);
router.put("/:id", updateBed);
router.delete("/:id", deleteBed);

module.exports = router;
