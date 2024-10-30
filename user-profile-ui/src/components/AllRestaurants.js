import React from 'react';
import { useNavigate } from 'react-router-dom';

const AllRestaurants = () => {
  const navigate = useNavigate();

  // Function to navigate back to home
  const handleReturnToHome = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>All Available Restaurants</h2>
      {/* Additional content can go here */}

      {/* Return to Home Button */}
      <button onClick={handleReturnToHome}>Return to Home</button>
    </div>
  );
};

export default AllRestaurants;
