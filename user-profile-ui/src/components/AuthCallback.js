import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token && username) {
      localStorage.setItem("authToken", token); // Store token securely
      navigate(`/profile/${username}`); // Redirect to profile page with username
    } else {
      console.error("Token or username missing in callback");
    }
  }, [navigate]);

  return <div>Processing authentication...</div>;
};

export default AuthCallback;
