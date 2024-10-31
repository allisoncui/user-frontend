// ViewAvailabilities.js

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAvailabilities = () => {
  const location = useLocation();
  const { restaurant } = location.state;
  const [availability, setAvailability] = useState(null);
  const [restaurantRating, setRestaurantRating] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initiate availability check and get rating in parallel
const fetchAvailabilityAndRating = async (restaurant_code) => {
  try {
    const availabilityMicroserviceUrl = process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL;
    const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;

    // Start the availability check with a POST request
    const initiateAvailabilityResponse = await axios.post(
      `${availabilityMicroserviceUrl}/availability/${restaurant_code}`
    );

    const statusUrl = initiateAvailabilityResponse.headers.location;

    // Run the rating request in parallel with polling for availability status
    const [ratingResponse] = await Promise.all([
      axios.get(`${restaurantMicroserviceUrl}/restaurant/${restaurant_code}/rating`),
      pollAvailabilityStatus(statusUrl)
    ]);

    // Set rating
    setRestaurantRating(ratingResponse.data.rating);

  } catch (error) {
    console.error("Error initiating availability or fetching rating:", error);
    setError("Failed to retrieve availability or rating.");
  }
};

// Polling function for availability status
const pollAvailabilityStatus = async (statusUrl) => {
  const intervalId = setInterval(async () => {
    try {
      const response = await axios.get(statusUrl);
      
      if (response.data.status === "complete") {
        setAvailability(response.data.data);
        clearInterval(intervalId);
      } else {
        console.log("Still processing, will check again...");
      }
    } catch (error) {
      console.error("Error polling availability status:", error);
      clearInterval(intervalId);
    }
  }, 5000); // Poll every 5 seconds
};

    fetchAvailabilityAndRating(restaurant.restaurant_code);
  }, [restaurant]);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>Available Times for {restaurant.name}:</h2>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          {availability ? (
            <div>
              <p>First available reservation:</p>
              <p>Date: {availability.date}</p>
              <p>Time: {availability.time}</p>
            </div>
          ) : (
            <p>Loading availability...</p>
          )}

          {restaurantRating !== null ? (
            <div>
              <h3>Restaurant Rating</h3>
              <p>Rating: {restaurantRating}</p>
            </div>
          ) : (
            <p>Loading rating...</p>
          )}
        </div>
      )}

      <button onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
};

export default ViewAvailabilities;
