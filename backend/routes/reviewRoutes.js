// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { createReview, getReviews } = require("../controllers/reviewController");

// POST route to create a new review
router.post("/", protect, createReview);

// GET route to fetch all reviews
router.get("/", getReviews);

module.exports = router;
