import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import AllRestaurants from "./AllRestaurants";
import axios from "axios";
import "../ProfileDetails.css";

const ProfileDetails = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const { profile, viewedRestaurants } = location.state || {};
  const [restaurantDetails, setRestaurantDetails] = useState({});

  const fetchAvailabilityAndRating = async (restaurant) => {
    try {
      const availabilityMicroserviceUrl = process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL;
      const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;

      const availabilityResponse = await axios.post(
        `${availabilityMicroserviceUrl}/availability/${restaurant.restaurant_code}`
      );

      const statusUrl = availabilityResponse.data._links.status;

      if (!statusUrl) {
        console.error("Error: 'location' header is missing in the response.");
        return { error: "Failed to retrieve the availability status URL." };
      }

      const availabilityData = await new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
          try {
            console.log(availabilityResponse)
            const response = await axios.get(`${statusUrl}`);

            if (response.data.status === "complete") {
              clearInterval(intervalId);
              resolve(response.data.data);
            } else {
              console.log("Still processing, will check again...");
            }
          } catch (error) {
            clearInterval(intervalId);
            reject(error);
          }
        }, 5000);
      });

      const ratingResponse = await axios.get(
        `${restaurantMicroserviceUrl}/restaurant/${restaurant.restaurant_code}/rating`
      );

      return {
        availability: availabilityData,
        rating: ratingResponse.data.rating,
      };
    } catch (error) {
      console.error("Error fetching availability or rating:", error);
      return { error: "Failed to retrieve availability or rating." };
    }
  };

  useEffect(() => {
    if (viewedRestaurants) {
      const fetchDetails = async () => {
        const details = {};
        for (const restaurant of viewedRestaurants) {
          details[restaurant.restaurant_code] = await fetchAvailabilityAndRating(restaurant);
        }
        setRestaurantDetails(details);
      };

      fetchDetails();
    }
  }, [viewedRestaurants]);

  return (
    <div className="profile-details-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="profile-details-header">{profile?.username || "User"}'s Profile</h2>
        <button
          className="back-to-home-button"
          onClick={() => navigate("/")} // Navigate to home page
        >
          Back to Home
        </button>
      </div>
      <div className="profile-details-columns">
        {/* Left Column: All Restaurants */}
        <div className="profile-column">
          <AllRestaurants username={profile?.username} />
        </div>

        {/* Right Column: Favorited Restaurants */}
        <div className="profile-column">
          <h3>Favorited Restaurants</h3>
          <ul className="viewed-restaurants-list">
            {viewedRestaurants?.map((restaurant) => (
              <li key={restaurant.restaurant_code} className="viewed-restaurant-item">
                <div>
                  <strong>{restaurant.name}</strong> (Code: {restaurant.restaurant_code})
                </div>
                <div className="restaurant-details">
                  {restaurantDetails[restaurant.restaurant_code]?.availability ? (
                    <div>
                      <p><strong>First available reservation:</strong></p>
                      <p>Date: {restaurantDetails[restaurant.restaurant_code].availability.date}</p>
                      <p>Time: {restaurantDetails[restaurant.restaurant_code].availability.time}</p>
                    </div>
                  ) : (
                    <p className="loading-text">Loading availability...</p>
                  )}

                  {restaurantDetails[restaurant.restaurant_code]?.rating !== undefined ? (
                    <div>
                      <h4>Restaurant Rating</h4>
                      <p>Rating: {restaurantDetails[restaurant.restaurant_code].rating}</p>
                    </div>
                  ) : (
                    <p>Loading rating...</p>
                  )}

                  {restaurantDetails[restaurant.restaurant_code]?.error && (
                    <p className="error-text">
                      {restaurantDetails[restaurant.restaurant_code].error}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
