import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAvailabilities = () => {
  const { restaurantName } = useParams();
  const decodedRestaurantName = decodeURIComponent(restaurantName);
  const [availabilities, setAvailabilities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch availability data for the restaurant
    const fetchAvailabilities = async () => {
      try {
        const availabilityMicroserviceUrl = process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL;
        const response = await axios.get(`${availabilityMicroserviceUrl}/availability/${decodedRestaurantName}`);
        setAvailabilities(response.data);  // Assuming the data contains the available reservations
      } catch (error) {
        console.error("Error fetching availabilities:", error);
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
      <ul>
        {availabilities.length > 0 ? (
          availabilities.map((availability, index) => (
            <li key={index}>{availability}</li> // Render available times
          ))
        ) : (
          <li>No availabilities found</li>
        )}
      </ul>
      <button onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
};

export default ViewAvailabilities;
