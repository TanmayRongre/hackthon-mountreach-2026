const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser
} = require("../Controllers/authController");

const router = express.Router();

// Routes for authentication operations
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
