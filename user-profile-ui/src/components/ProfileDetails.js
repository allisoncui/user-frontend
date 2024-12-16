import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AllRestaurants from "./AllRestaurants";
import "../ProfileDetails.css";

const ProfileDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username: paramUsername } = useParams();
  const { profile: initialProfile, viewedRestaurants: initialViewedRestaurants } = location.state || {};

  const [profile, setProfile] = useState(initialProfile || null);
  const [viewedRestaurants, setViewedRestaurants] = useState(initialViewedRestaurants || []);
  const [restaurantDetails, setRestaurantDetails] = useState({});

  const fetchViewedRestaurants = async (username) => {
    try {
      const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;
      const response = await axios.get(`${restaurantMicroserviceUrl}/user/${username}/viewed_restaurants`);
      setViewedRestaurants(response.data.viewed_restaurants || []);
    } catch (error) {
      console.error("Error fetching viewed restaurants:", error);
    }
  };

  const fetchAvailabilityAndRating = async (restaurant) => {
    try {
      const availabilityMicroserviceUrl = process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL;
      const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;

      // Fetch availability
      const availabilityResponse = await axios.post(
        `${availabilityMicroserviceUrl}/availability/${restaurant.restaurant_code}`
      );
      const statusUrl = availabilityResponse.data._links?.status;

      const availabilityData = statusUrl
        ? await new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
              try {
                const response = await axios.get(`${statusUrl}`);
                if (response.data.status === "complete") {
                  clearInterval(intervalId);
                  resolve(response.data.data);
                }
              } catch (error) {
                clearInterval(intervalId);
                reject(error);
              }
            }, 60000); // Check status every minute
          })
        : null;

      // Fetch rating
      const ratingResponse = await axios.get(
        `${restaurantMicroserviceUrl}/restaurant/${restaurant.restaurant_code}/rating`
      );

      return {
        availability: availabilityData,
        rating: ratingResponse.data.rating,
      };
    } catch (error) {
      console.error("Error fetching availability or rating for restaurant:", error);
      return { error: "Failed to fetch availability or rating." };
    }
  };

  // Fetch profile and initial viewed restaurants
  useEffect(() => {
    const fetchProfileAndRestaurants = async () => {
      try {
        if (!profile) {
          const userMicroserviceUrl = process.env.REACT_APP_USER_MICROSERVICE_URL;
          const userResponse = await axios.get(`${userMicroserviceUrl}/user/${paramUsername}`);
          setProfile(userResponse.data);
        }

        fetchViewedRestaurants(paramUsername);
      } catch (error) {
        console.error("Error fetching profile or restaurants:", error);
        navigate("/"); // Redirect to home if data fetch fails
      }
    };

    fetchProfileAndRestaurants();
  }, [paramUsername, profile, navigate]);

  // Poll for updated viewedRestaurants
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (profile?.username) {
        fetchViewedRestaurants(profile.username);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [profile?.username]);

  // Fetch availability and ratings when viewedRestaurants changes
  useEffect(() => {
    if (viewedRestaurants.length > 0) {
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

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-details-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="profile-details-header">{profile.username}'s Profile</h2>
        <button
          className="back-to-home-button"
          onClick={() => navigate("/")}
        >
          Sign Out
        </button>
      </div>
      <div className="profile-details-columns">
        <div className="profile-column">
          <AllRestaurants username={profile.username} />
        </div>
        <div className="profile-column">
          <h3>Favorited Restaurants</h3>
          <ul className="viewed-restaurants-list">
            {viewedRestaurants.map((restaurant) => (
              <li key={restaurant.restaurant_code} className="viewed-restaurant-item">
                <strong>{restaurant.name}</strong> (Code: {restaurant.restaurant_code})
                <div className="restaurant-details">
                  {restaurantDetails[restaurant.restaurant_code]?.availability ? (
                    restaurantDetails[restaurant.restaurant_code].availability.date &&
                    restaurantDetails[restaurant.restaurant_code].availability.time ? (
                      <div>
                        <p><strong>First available reservation:</strong></p>
                        <p>Date: {restaurantDetails[restaurant.restaurant_code].availability.date}</p>
                        <p>Time: {restaurantDetails[restaurant.restaurant_code].availability.time}</p>
                      </div>
                    ) : (
                      <p>No reservations available</p>
                    )
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
                    <p className="error-text">{restaurantDetails[restaurant.restaurant_code].error}</p>
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
