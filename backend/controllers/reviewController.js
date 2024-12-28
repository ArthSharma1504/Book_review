const Review = require("../models/Review");

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
    const reviews = await Review.find().populate("user", "username email");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure the logged-in user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this review" });
    }

    await review.remove();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { title, content, rating } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure the logged-in user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to update this review" });
    }

    // Update the fields
    if (title) review.title = title;
    if (content) review.content = content;
    if (rating) review.rating = rating;

    const updatedReview = await review.save();
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

module.exports = { createReview, getReviews, deleteReview, updateReview };
