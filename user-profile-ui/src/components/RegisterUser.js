import React, { useState } from "react";
import axios from "axios";

const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const registerUser = async () => {
    try {
      const userMicroserviceUrl = process.env.REACT_APP_USER_MICROSERVICE_URL;
      const response = await axios.post(`${userMicroserviceUrl}/user/${username}/register`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.detail || "Error registering user");
    }
  };


  return (
    <div>
      <h2>Register User</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={registerUser}>Register</button>
      <p>{message}</p>
    </div>
  );
};

export default RegisterUser;
