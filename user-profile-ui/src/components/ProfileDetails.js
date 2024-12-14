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

  useEffect(() => {
    const fetchProfileAndRestaurants = async () => {
      try {
        if (!profile) {
          const userMicroserviceUrl = process.env.REACT_APP_USER_MICROSERVICE_URL;
          const userResponse = await axios.get(`${userMicroserviceUrl}/user/${paramUsername}`);
          setProfile(userResponse.data);
        }

        if (viewedRestaurants.length === 0) {
          const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;
          const restaurantsResponse = await axios.get(
            `${restaurantMicroserviceUrl}/user/${paramUsername}/viewed_restaurants`
          );
          setViewedRestaurants(restaurantsResponse.data.viewed_restaurants || []);
        }
      } catch (error) {
        console.error("Error fetching profile or restaurants:", error);
        navigate("/"); // Redirect to home if data fetch fails
      }
    };

    fetchProfileAndRestaurants();
  }, [paramUsername, profile, viewedRestaurants.length, navigate]);

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
          Back to Home
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
