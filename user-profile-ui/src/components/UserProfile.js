// UserProfile.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [viewedRestaurants, setViewedRestaurants] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const userMicroserviceUrl = process.env.REACT_APP_USER_MICROSERVICE_URL;
      const response = await axios.get(`${userMicroserviceUrl}/user/${username}`);
      setProfile(response.data);
      setError("");
      fetchViewedRestaurants(username);
    } catch (error) {
      setError(error.response?.data?.detail || "User not found");
      setProfile(null);
      setUsername("");
    }
  };

  const fetchViewedRestaurants = async (username) => {
    try {
      const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;
      const response = await axios.get(`${restaurantMicroserviceUrl}/user/${username}/viewed_restaurants`);
      const data = response.data.viewed_restaurants || [];
      setViewedRestaurants(data);
    } catch (error) {
      console.error("Error fetching viewed restaurants:", error);
      setViewedRestaurants([]);
    }
  };

  useEffect(() => {
  if (profile) {
    console.log("Profile fetched:", profile);

    // Redirect to the profile page even if viewed_restaurants is empty
    navigate(`/profile/${encodeURIComponent(username)}`, {
      state: { profile, viewedRestaurants },
    });
  } else {
    console.log("No profile data available.");
  }
  }, [profile, viewedRestaurants, navigate, username]);

  /*
  const handleViewAvailability = (restaurant) => {
    navigate(`/availability/${encodeURIComponent(restaurant.name)}`, {
      state: { restaurant: restaurant }
    });
  };

  const handleViewAllRestaurants = () => {
    navigate("/all-restaurants", { state: { username } });
  };
  */

  return (
    <div>
      <h3>Find User</h3>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginRight: '12px' }}
      />
      <button onClick={fetchProfile}>Fetch Profile</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/*
      {profile && (
        <div>
          <h3>Profile Info</h3>
          <p>Username: {profile.username}</p>
          <p>Viewed Restaurants:</p>
          <ul>
            {viewedRestaurants.map((restaurant) => (
              <li key={restaurant.restaurant_code}>
                {restaurant.name} (Code: {restaurant.restaurant_code})
                <button onClick={() => handleViewAvailability(restaurant)}>
                  View Availability and Rating
                </button>
              </li>
            ))}
          </ul>
            
          <button onClick={handleViewAllRestaurants} style={{ marginTop: "20px" }}>
            View All Restaurants
          </button>
        </div>
            )} */}
    </div>
  );
};

export default UserProfile;
