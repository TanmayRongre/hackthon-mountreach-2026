const express = require("express");

const {
  getMesses,
  getMessById,
  createMess,
  updateMess,
  deleteMess
} = require("../controllers/messController");

const router = express.Router();

// Routes for mess operations
router.get("/", getMesses);
router.get("/:id", getMessById);
router.post("/", createMess);
router.put("/:id", updateMess);
router.delete("/:id", deleteMess);

module.exports = router;
