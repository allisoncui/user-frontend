import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import RegisterUser from "./components/RegisterUser";
import ViewAvailabilities from "./components/ViewAvailabilities";
import AllRestaurants from "./components/AllRestaurants"; // Import the new component
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
                <h1>User Profile Service</h1>
                <RegisterUser />
                <UserProfile />
              </>
            }
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
