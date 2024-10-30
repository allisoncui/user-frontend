import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ViewAvailabilities = () => {
  const { restaurantName } = useParams();
  const decodedRestaurantName = decodeURIComponent(restaurantName);
  const navigate = useNavigate();

  // Function to navigate back to home
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>{decodedRestaurantName} Available Times</h2>
      {/* Additional content can go here */}

      {/* Back to Home Button */}
      <button onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
};

export default ViewAvailabilities;
