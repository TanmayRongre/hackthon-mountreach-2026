const express = require("express");

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const router = express.Router();

// Routes for user operations
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
