import React, { useState } from "react";
import axios from "axios";

const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const registerUser = async () => {
    try {
      const userMicroserviceUrl = process.env.REACT_APP_USER_MICROSERVICE_URL;
      const response = await axios.post(`${userMicroserviceUrl}/user/${username}/register`);
      if (response.status === 201) {
        setMessage("User registered successfully");
      } else if (response.status === 200) {
        setMessage("User already exists");
      }
    } catch (error) {
      setMessage(error.response.data.detail || "Error registering user");
      setUsername("");
    }
  };

  const handleGoogleLogin = () => {
    // Redirects to the backend's Google login endpoint
    window.location.href = 'http://localhost:8000/login/google';
  };

  return (
    <div>
      <h2>Register User</h2>
      <div>
        <label>Username: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <button onClick={registerUser}>Register</button>
      <button onClick={handleGoogleLogin} style={{ marginLeft: "10px" }}>
        Register with Google
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterUser;
