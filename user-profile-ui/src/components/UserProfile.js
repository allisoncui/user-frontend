import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [viewedRestaurants, setViewedRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("")

   useEffect(() => {
    console.log("User Microservice URL:", process.env.REACT_APP_USER_MICROSERVICE_URL);
    console.log("Restaurant Microservice URL:", process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL);
    console.log("Availability Microservice URL:", process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL);
  }, []);

  // Fetch user profile from User Microservice
  const fetchProfile = async () => {
    try {
      const userMicroserviceUrl = process.env.REACT_APP_USER_MICROSERVICE_URL;
      const response = await axios.get(`${userMicroserviceUrl}/user/${username}`);
      setProfile(response.data);
      setError("");

      // Fetch viewed restaurants after fetching the profile
      fetchViewedRestaurants(username);
      setUsername("");
    } catch (error) {
      setError(
        error.response && error.response.data
          ? error.response.data.detail
          : "User not found"
      );
      setProfile(null);
      setUsername("");
    }
  };

  // Fetch viewed restaurants from Restaurant Microservice
  const fetchViewedRestaurants = async (username) => {
    try {
      const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;
      const response = await axios.get(`${restaurantMicroserviceUrl}/user/${username}/viewed_restaurants`);
      setViewedRestaurants(response.data.viewed_restaurants);
    } catch (error) {
      console.error("Error fetching viewed restaurants:", error);
      setViewedRestaurants([]); // Clear restaurants on error
    }
  };

<<<<<<< HEAD
  // View availability for a specific restaurant
  const viewAvailability = async (restaurantCode) => {
    try {
      const availabilityMicroserviceUrl = process.env.REACT_APP_AVAILABILITY_MICROSERVICE_URL;
      const payload = {
        callback_url: callbackUrl || undefined,
      };

      // Send POST request to the availability microservice
      const response = await axios.post(
        `${availabilityMicroserviceUrl}/availability/${username}`,
        payload
      );

      if (response.status === 202) {
        const statusUrl = response.headers.location;
        console.log("Request accepted. Polling for results at:", statusUrl);

        if (!callbackUrl) {
          pollAvailabilityStatus(statusUrl);
        }
      }
    } catch (error) {
      console.error("Error initiating availability check:", error);
    }
  };

  // Polling function to check availability status
  const pollAvailabilityStatus = async (statusUrl) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(statusUrl);
        if (response.data.status === "complete") {
          console.log("Availability data:", response.data.data);
          clearInterval(intervalId); // Stop polling when data is ready
        } else {
          console.log("Still processing, will check again...");
        }
      } catch (error) {
        console.error("Error polling availability status:", error);
        clearInterval(intervalId);
      }
    }, 5000); // Poll every 5 seconds
  };

=======
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchProfile(); // Trigger the profile fetch if Enter is pressed
    }
  };

>>>>>>> 1ab2cb7aca00e2f8383adfe370e75af4e4c2c761
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

      {/* Input for callback URL */}
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
                    onClick={() => viewAvailability(restaurant.restaurant_code)}
                  >
                    View Availabilities
                  </button>
                </li>
              ))
            ) : (
              <li>No restaurants viewed</li>
            )}
          </ul>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UserProfile;
