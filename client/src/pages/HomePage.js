// client/src/pages/HomePage.js
import React, { useState, useEffect } from "react"; // Add useState
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import AddTaskForm from "../component/tasks/AddTaskForm"; // Import components
import TaskList from "../component/tasks/TaskList";

const HomePage = () => {
  const [tasks, setTasks] = useState([]); // State to hold the list of tasks
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(""); // State for fetch errors
  const navigate = useNavigate();

  // --- Fetch User's Tasks ---
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Start loading
      setError(""); // Clear previous errors
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login.");
        navigate("/login");
        return; // Exit if no token
      }

      try {
        // Prepare headers with the token
        const config = {
          headers: { "x-auth-token": token },
        };
        // Make GET request to the tasks endpoint
        const res = await axios.get(
          "https://deadline-reminder-app.onrender.com/api/tasks",
          config
        );
        setTasks(res.data); // Update state with fetched tasks
      } catch (err) {
        console.error(
          "Fetch tasks error:",
          err.response ? err.response.data : err
        );
        setError("Failed to load tasks.");
        // Handle specific errors like invalid token (401)
        if (err.response && err.response.status === 401) {
          setError("Authentication failed. Please log in again.");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login"); // Redirect
        }
      } finally {
        setLoading(false); // Stop loading regardless of success/error
      }
    };

    fetchTasks();
  }, [navigate]); // Run effect on mount (and if navigate changes)

  // --- Logout Handler ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Logged out, redirecting to login.");
    navigate("/login");
  };

  // --- Handler: Called by AddTaskForm when a task is successfully added ---
  const handleTaskAdded = (newTask) => {
    // Add the new task to the existing tasks array in state
    // Also re-sort by deadline after adding
    setTasks((prevTasks) =>
      [...prevTasks, newTask].sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      )
    );
  };

  // --- Handler: Called by TaskList/TaskItem when a task is deleted ---
  const handleTaskDeleted = (deletedTaskId) => {
    // Filter out the deleted task from the state
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id !== deletedTaskId)
    );
  };

  // --- Handler: Called by TaskList/TaskItem when task completion status changes ---
  const handleTaskCompleted = (updatedTask) => {
    // Find the task in the state and replace it with the updated version
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  // Don't render anything until authentication check (via useEffect fetch) completes or determines redirection
  // if (!localStorage.getItem('token')) { // Can keep this simple check too
  //     return null;
  // }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h1>Your Deadline Reminders</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <hr />

      {/* Render Add Task Form, passing the handler function as a prop */}
      <AddTaskForm onTaskAdded={handleTaskAdded} />

      <hr />

      {/* Display Loading or Error messages */}
      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render Task List only when not loading and no error */}
      {!loading && !error && (
        <TaskList
          tasks={tasks} // Pass the tasks state down
          onTaskDeleted={handleTaskDeleted} // Pass delete handler
          onTaskCompleted={handleTaskCompleted} // Pass completion handler
        />
      )}
    </div>
  );
};

export default HomePage;
