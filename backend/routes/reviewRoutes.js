const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createReview,
  getReviews,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");

router.post("/", protect, createReview);
router.get("/", protect, getReviews);
router.delete("/:id", protect, deleteReview);
router.put("/:id", protect, updateReview);

module.exports = router;
