import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ViewAvailabilities = () => {
  const { restaurantName } = useParams();
  const decodedRestaurantName = decodeURIComponent(restaurantName);
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the passed rating from navigation state
  const restaurantRating = location.state?.rating || null;

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const availabilityMicroserviceUrl = process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL;
        const availabilityResponse = await axios.get(
          `${availabilityMicroserviceUrl}/availability/${decodedRestaurantName}`
        );

        if (availabilityResponse.data) {
          setAvailability(availabilityResponse.data);
        } else {
          setError("No availability found.");
        }
      } catch (error) {
        console.error("Error fetching availabilities:", error);
        setError("Error fetching availability data.");
      }
    };

    fetchAvailability();
  }, [decodedRestaurantName]);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>{decodedRestaurantName} Available Times</h2>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          {availability ? (
            <div>
              <p>First available reservation for {availability.restaurant}</p>
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
