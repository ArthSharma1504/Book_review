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
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        console.log('Token on fetchReviews:', token); // Log the token for debugging

        if (!token) {
          console.warn('No token found. Please log in again.');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/reviews', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in header
          },
        });

        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/login');
        }
      }
    };

    fetchReviews();
  }, [navigate]);

  // Handle adding a new review
  const handleAddReview = async () => {
    if (!bookTitle || !newReview) {
      alert('Please enter both a book title and a review.');
      return;
    }
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      console.log('Token on handleAddReview:', token); // Log the token for debugging

      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          title: bookTitle,
          content: newReview, // Correct variable
          rating: 5, // Default rating or you can add an input for this
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to the header
          },
        }
      );

      setReviews([...reviews, response.data]);
      setBookTitle('');
      setNewReview('');
    } catch (err) {
      console.error('Error adding review:', err);
      if (err.response?.status === 401) {
        alert('Unauthorized! Please log in again.');
        navigate('/login');
      }
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (id, reviewUserId) => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Add this to check the token value

    if (!token) {
      console.warn('No token found. Please log in again.');
      navigate('/login');
      return;
    }

    const loggedInUser = localStorage.getItem('userId'); // Assuming userId is saved in localStorage when the user logs in

    if (loggedInUser !== reviewUserId) {
      alert('You can only delete your own reviews.');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in header
        },
      });

      if (response.status === 200) {
        setReviews(reviews.filter((review) => review._id !== id)); // Remove the deleted review from state
        console.log('Review deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login');
      }
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
              <p>{review.content}</p>
              {/* Check if the logged-in user is the owner of the review */}
              <button onClick={() => handleDeleteReview(review._id, review.user._id)}>
                Delete
              </button>
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
