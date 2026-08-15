const express = require("express");

const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
} = require("../Controllers/noticeController");

const router = express.Router();

// Routes for notice operations
router.get("/", getNotices);
router.get("/:id", getNoticeById);
router.post("/", createNotice);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

module.exports = router;
