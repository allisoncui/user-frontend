import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileDetails = () => {
  const location = useLocation();
  const { profile, viewedRestaurants } = location.state || {};
  const navigate = useNavigate();

  const handleViewAvailability = (restaurant) => {
    navigate(`/availability/${encodeURIComponent(restaurant.name)}`, {
      state: { restaurant },
    });
  };

  const handleViewAllRestaurants = () => {
    navigate("/all-restaurants", { state: { username: profile?.username } });
  };

  const handleBackToHome = () => {
      navigate("/");
  };

  return (
    <div>
      {profile ? (
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

          {/* Back to home button */}
          <button onClick={handleBackToHome} style={{ marginTop: "20px" }}>
            Back to Home
          </button>
        </div>
      ) : (
        <p style={{ color: "red" }}>No profile data found. Please try again.</p>
      )}
    </div>
  );
};

export default ProfileDetails;
