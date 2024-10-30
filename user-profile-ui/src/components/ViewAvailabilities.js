import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAvailabilities = () => {
  const { restaurantName } = useParams();
  const decodedRestaurantName = decodeURIComponent(restaurantName);
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const availabilityMicroserviceUrl = process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL;
        const response = await axios.get(`${availabilityMicroserviceUrl}/availability/${decodedRestaurantName}`);
        
        if (response.data) {
          setAvailability(response.data);  // Set the first available reservation
        } else {
          setError("No availability found.");
        }
      } catch (error) {
        console.error("Error fetching availabilities:", error);
        setError("Error fetching availability data.");
      }
    };
  
    fetchAvailabilities();
  }, [decodedRestaurantName]);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>{decodedRestaurantName} Available Times</h2>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : availability ? (
        <div>
          <p>First available reservation for {availability.restaurant}</p>
          <p>Date: {availability.date}</p>
          <p>Time: {availability.time}</p>
        </div>
      ) : (
        <p>Loading availability...</p>
      )}


      <button onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
};

export default ViewAvailabilities;
