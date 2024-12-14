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

      // Fetch user profile
      const response = await axios.get(`${userMicroserviceUrl}/user/${username}`);
      const fetchedProfile = response.data;
      setProfile(fetchedProfile);

      // Fetch viewed restaurants
      await fetchViewedRestaurants(username);

      // Clear any existing errors
      setError("");
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.response?.data?.detail || "User not found");
      setProfile(null);
    }
  };

  const fetchViewedRestaurants = async (username) => {
    try {
      const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;

      // Fetch viewed restaurants for the user
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

      // Navigate to the profile page regardless of whether viewed_restaurants is empty
      navigate(`/profile/${encodeURIComponent(username)}`, {
        state: { profile, viewedRestaurants },
      });
    }
  }, [profile, viewedRestaurants, navigate, username]);

  return (
    <div>
      <h3>Find User</h3>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginRight: "12px" }}
      />
      <button onClick={fetchProfile}>Fetch Profile</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UserProfile;
