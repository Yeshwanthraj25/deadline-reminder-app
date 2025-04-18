// client/src/components/tasks/AddTaskForm.js
import React, { useState } from "react";
import axios from "axios";

// This component receives a function 'onTaskAdded' as a prop
// which it calls when a task is successfully created.
const AddTaskForm = ({ onTaskAdded }) => {
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!description || !deadline) {
      setError("Please fill in both description and deadline.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get token
      if (!token) {
        setError("Authentication error. Please log in again.");
        // Optionally redirect: navigate('/login');
        return;
      }

      // Set up headers for the authenticated request
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token, // Include the JWT token
        },
      };

      // Prepare the data payload
      const body = JSON.stringify({ description, deadline });

      // Make the POST request to the backend tasks endpoint
      const res = await axios.post(
        "https://deadline-reminder-app.onrender.com/api/tasks", // Ensure Port 5005 is correct
        body,
        config // Pass headers
      );

      // If successful, call the prop function passed from HomePage
      // to add the new task to the list in the parent component's state
      onTaskAdded(res.data);

      // Clear the form fields
      setDescription("");
      setDeadline("");
    } catch (err) {
      console.error("Add task error:", err.response ? err.response.data : err);
      // Display specific validation errors or a generic message
      const errorMsg = err.response?.data?.errors
        ? err.response.data.errors.map((e) => e.msg).join(", ")
        : err.response?.data?.msg || "Failed to add task.";
      setError(errorMsg);
      // Handle potential auth error (e.g., invalid token)
      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        // Optionally clear token and redirect
        // localStorage.removeItem('token');
        // navigate('/login');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ccc",
      }}
    >
      <h3>Add New Deadline Task</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px" }}>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "80%" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "25px" }}>Deadline:</label>
        <input
          type="datetime-local" // Input type for date and time
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
