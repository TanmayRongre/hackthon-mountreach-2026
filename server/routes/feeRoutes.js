const express = require("express");

const {
  getFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee
} = require("../controllers/feeController");

const router = express.Router();

// Routes for fee operations
router.get("/", getFees);
router.get("/:id", getFeeById);
router.post("/", createFee);
router.put("/:id", updateFee);
router.delete("/:id", deleteFee);

module.exports = router;
