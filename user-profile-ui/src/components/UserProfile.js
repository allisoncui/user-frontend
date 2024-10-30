import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [viewedRestaurants, setViewedRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [availabilityData, setAvailabilityData] = useState(null);
  const [restaurantRating, setRestaurantRating] = useState(null);

  useEffect(() => {
    console.log("User Microservice URL:", process.env.REACT_APP_USER_MICROSERVICE_URL);
    console.log("Restaurant Microservice URL:", process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL);
    console.log("Availability Microservice URL:", process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL);
  }, []);

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
      setViewedRestaurants(response.data.viewed_restaurants);
    } catch (error) {
      console.error("Error fetching viewed restaurants:", error);
      setViewedRestaurants([]);
    }
  };

  // Separate function to fetch restaurant rating
  const fetchRestaurantRating = async (restaurant_code) => {
    try {
      const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;
      const ratingResponse = await axios.get(`${restaurantMicroserviceUrl}/restaurant/${restaurant_code}/rating`);
      setRestaurantRating(ratingResponse.data.rating);
    } catch (error) {
      console.error("Error fetching restaurant rating:", error);
    }
  };

  // Separate function to fetch restaurant availability
  const fetchAvailability = async (restaurant_code) => {
    try {
      const availabilityMicroserviceUrl = process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL;
      const payload = { callback_url: callbackUrl || undefined };
      const availabilityResponse = await axios.post(
        `${availabilityMicroserviceUrl}/availability/${restaurant_code}`,
        payload
      );

      if (availabilityResponse.status === 202) {
        const statusUrl = availabilityResponse.headers.location;
        pollAvailabilityStatus(statusUrl);
      }
    } catch (error) {
      console.error("Error initiating availability check:", error);
    }
  };

  // Polling function for availability
  const pollAvailabilityStatus = async (statusUrl) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(statusUrl);
        if (response.data.status === "complete") {
          setAvailabilityData(response.data.data);
          clearInterval(intervalId);
        } else {
          console.log("Still processing, will check again...");
        }
      } catch (error) {
        console.error("Error polling availability status:", error);
        clearInterval(intervalId);
      }
    }, 5000);
  };

  // Event handler to fetch availability and rating concurrently
  const viewAvailabilityAndRating = async (restaurant_code) => {
    const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;
    const availabilityMicroserviceUrl = process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL;

    console.log(`Fetching rating from: ${restaurantMicroserviceUrl}/restaurant/${restaurant_code}/rating`);
    console.log(`Fetching availability from: ${availabilityMicroserviceUrl}/availability/${restaurant_code}`);

  try {
    await Promise.all([
      fetchRestaurantRating(restaurant_code),
      fetchAvailability(restaurant_code)
    ]);
  } catch (error) {
    console.error("Error in concurrent fetch:", error);
  }
};


  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchProfile();
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
        onKeyPress={handleKeyPress}
      />
      <button onClick={fetchProfile}>Fetch Profile</button>

      <div>
        <input
          type="text"
          placeholder="Enter callback URL (optional)"
          value={callbackUrl}
          onChange={(e) => setCallbackUrl(e.target.value)}
        />
      </div>

      {profile && (
        <div>
          <h3>Profile Info</h3>
          <p>Username: {profile.username}</p>
          <p>Viewed Restaurants:</p>
          <ul>
            {viewedRestaurants.length > 0 ? (
              viewedRestaurants.map((restaurant) => (
                <li key={restaurant.restaurant_code}>
                  {restaurant.name} (Code: {restaurant.restaurant_code})
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => viewAvailabilityAndRating(restaurant.restaurant_code)}
                  >
                    View Availability and Rating
                  </button>
                </li>
              ))
            ) : (
              <li>No restaurants viewed</li>
            )}
          </ul>
        </div>
      )}

      {availabilityData && (
        <div>
          <h3>Availability Data</h3>
          <p>
            {availabilityData.restaurant}: {availabilityData.date} at {availabilityData.time}
          </p>
        </div>
      )}

      {restaurantRating !== null && (
        <div>
          <h3>Restaurant Rating</h3>
          <p>Rating: {restaurantRating}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UserProfile;
