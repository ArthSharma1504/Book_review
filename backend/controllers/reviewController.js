// controllers/reviewController.js
const Review = require("../models/Review"); // Assuming you have a Review model

// Create a new review
const createReview = async (req, res) => {
  try {
    const { title, content, rating } = req.body;

    // Create a new review
    const review = new Review({
      user: req.user.id, // User ID from the middleware
      title,
      content,
      rating,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};

// Get all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

module.exports = { createReview, getReviews };
