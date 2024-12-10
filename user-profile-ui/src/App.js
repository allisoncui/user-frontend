import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import RegisterUser from "./components/RegisterUser";
import ViewAvailabilities from "./components/ViewAvailabilities";
import AllRestaurants from "./components/AllRestaurants";
import AuthCallback from "./components/AuthCallback";
import ProfileDetails from "./components/ProfileDetails";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                <h1>Welcome to Bro Knows a Spot</h1>
                <div class="home-description">
                  This cloud-based application helps Resy users search across restaurants and have an easier time securing the reservations they desire. <br></br><br></br>
                  Semester project for COMS4153.
                </div>
                <RegisterUser />
                <UserProfile />
              </>
            }
          />

          {/* Profile Details Route */}
          <Route
            path="/profile/:username"
            element={<ProfileDetails />}
          />

          {/* ViewAvailabilities Route */}
          <Route
            path="/availability/:restaurantName"
            element={<ViewAvailabilities />}
          />

          {/* AllRestaurants Route */}
          <Route
            path="/all-restaurants"
            element={<AllRestaurants />}
          />

          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
