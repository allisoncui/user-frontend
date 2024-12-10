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
      {/* <h2>Register User</h2> */}
      <button onClick={handleGoogleLogin} style={{ marginLeft: "10px" }}>
        Register with Google
      </button>
      <div style={{ paddingTop: '20px' }}>
        <h3>Register New User</h3>
        {/* <label>Username: </label> */}
        <input
          type="text"
          placeholder="Enter new username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: '12px' }}
        />
        <button onClick={registerUser}>Register</button>
        {message && <p>{message}</p>}
      </div>

    </div>
  );
};

export default RegisterUser;
