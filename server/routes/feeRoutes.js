const express = require("express");
const {
  getFees,
  getFeeById,
  createFee,
  payFee,
  updateFee,
  deleteFee
} = require("../controllers/feeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for fee operations
router.get("/", protect, getFees);
router.get("/:id", protect, getFeeById);
router.post("/", protect, createFee);
router.post("/:id/pay", protect, payFee);
router.put("/:id", protect, updateFee);
router.delete("/:id", protect, deleteFee);

module.exports = router;
