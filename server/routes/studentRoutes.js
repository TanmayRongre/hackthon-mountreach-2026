const express = require("express");
const {
  getMyStudentProfile,
  admitStudent,
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Student's own profile and admission routes
router.get("/me", protect, getMyStudentProfile);
router.post("/admit", protect, admitStudent);

// Standard CRUD routes
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", protect, createStudent);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);

module.exports = router;