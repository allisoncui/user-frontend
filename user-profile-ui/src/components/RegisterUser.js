import React, { useState } from "react";
import axios from "axios";
import '../App.css';
import googleLogo from "../Google-Logo.svg";

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
        setMessage("User already exists...");
      }
    } catch (error) {
      setMessage(error.response.data.detail || "Error registering user");
      setUsername("");
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20email%20profile`;
    window.location.href = googleOAuthUrl;
  };

  return (
    <div>
      {/* <h2>Register User</h2> */}
      <button onClick={handleGoogleLogin} className="google-button">
        <img src={googleLogo} alt="Google logo" className="google-logo" />
        <span className="google-button-text">Register with Google</span>
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
