import React, { useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [viewedRestaurants, setViewedRestaurants] = useState([]);
  const [error, setError] = useState("");

  // Fetch user profile from User Microservice
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://54.173.208.182:8000/user/${username}`);
      setProfile(response.data);
      setError("");

      // Fetch viewed restaurants after fetching the profile
      fetchViewedRestaurants(username);
    } catch (error) {
      setError(
        error.response && error.response.data
          ? error.response.data.detail
          : "User not found"
      );
      setProfile(null);
    }
  };

  // Fetch viewed restaurants from Restaurant Microservice
  const fetchViewedRestaurants = async (username) => {
    try {
      const response = await axios.get(`http://54.173.208.182:8000/user/${username}/viewed_restaurants`);
      setViewedRestaurants(response.data.viewed_restaurants);
    } catch (error) {
      console.error("Error fetching viewed restaurants:", error);
      setViewedRestaurants([]); // Clear restaurants on error
    }
  };

  return (
    <div>
      <h2>Get User Profile</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={fetchProfile}>Fetch Profile</button>

      {/* Display profile information if it exists */}
      {profile && (
        <div>
          <h3>Profile Info</h3>
          <p>Username: {profile.username}</p>
          <p>Viewed Restaurants:</p>
          <ul>
            {/* Display the list of viewed restaurants */}
            {viewedRestaurants.length > 0 ? (
              viewedRestaurants.map((restaurant) => (
                <li key={restaurant.restaurant_code}>
                  {restaurant.name} (Code: {restaurant.restaurant_code})
                </li>
              ))
            ) : (
              <li>No restaurants viewed</li>
            )}
          </ul>
        </div>
      )}

      {/* Display error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UserProfile;
