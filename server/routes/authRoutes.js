const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for authentication operations
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.get("/profile", protect, getMe);

module.exports = router;
