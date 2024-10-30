import React from "react";
import UserProfile from "./components/UserProfile";
import RegisterUser from "./components/RegisterUser";
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>User Profile Service</h1>
      <RegisterUser />
      <UserProfile />
    </div>
  );
}

export default App;
