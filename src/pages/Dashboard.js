// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const navigate = useNavigate();

  // Fetch reviews from the server
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews');
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  // Handle adding a new review
  const handleAddReview = async () => {
    if (!bookTitle || !newReview) {
      alert('Please enter both a book title and a review.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/reviews', {
        title: bookTitle,
        review: newReview,
      });
      setReviews([...reviews, response.data]);
      setBookTitle('');
      setNewReview('');
    } catch (err) {
      console.error('Error adding review:', err);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to the Book Review Platform!</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="review-form">
        <input
          type="text"
          placeholder="Book Title"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your review here..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        ></textarea>
        <button onClick={handleAddReview}>Add Review</button>
      </div>
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <h3>{review.title}</h3>
              <p>{review.review}</p>
              <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to add one!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
