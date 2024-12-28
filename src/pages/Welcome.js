import React from 'react';
import '../styles/Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome">
      <div className="animation">
        <h1>Welcome to Book Review</h1>
        <p>Your go-to platform for sharing book reviews.</p>
        <button onClick={() => (window.location.href = '/register')}>Get Started</button>
      </div>
    </div>
  );
};

export default Welcome;
