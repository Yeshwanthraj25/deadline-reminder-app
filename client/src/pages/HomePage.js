// client/src/pages/HomePage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  // Basic check if "logged in" (token exists). Redirect if not.
  // Note: This doesn't verify if the token is *valid*.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login");
    }
  }, [navigate]); // Run check on component mount

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from storage
    console.log("Logged out, redirecting to login.");
    navigate("/login"); // Redirect to login page
  };

  // Only render content if token exists (prevents flash of content before redirect)
  if (!localStorage.getItem("token")) {
    return null; // Or a loading indicator
  }

  return (
    <div>
      <h1>Welcome! You are Logged In (Basic Check)!</h1>
      <p>Your task list will go here.</p>
      <button onClick={handleLogout}>Logout</button>
      {/* Add Task Form and Task List components will go here in Day 5 */}
    </div>
  );
};

export default HomePage;
