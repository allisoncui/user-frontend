import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token); // Store token securely
      navigate("/"); // Redirect to profile page
    } else {
      console.error("Token missing in callback");
    }
  }, [navigate]);

  return <div>Processing authentication...</div>;
};

export default AuthCallback;
