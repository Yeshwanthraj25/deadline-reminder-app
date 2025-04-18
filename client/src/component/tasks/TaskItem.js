// client/src/components/tasks/TaskItem.js
import React from "react";
import axios from "axios";

// Receives a single task object and handler functions as props
const TaskItem = ({ task, onTaskDeleted, onTaskCompleted }) => {
  // Handler for the delete button click
  const handleDelete = async () => {
    // Ask for confirmation before deleting
    if (
      window.confirm(`Are you sure you want to delete "${task.description}"?`)
    ) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };

        // Send DELETE request to the specific task endpoint
        await axios.delete(
          `http://localhost:5005/api/tasks/${task._id}`,
          config
        );

        // Call the prop function passed from TaskList/HomePage to remove from UI
        onTaskDeleted(task._id);
      } catch (err) {
        console.error(
          "Delete task error:",
          err.response ? err.response.data : err
        );
        alert("Failed to delete task. Please try again.");
        if (err.response?.status === 401) {
          alert("Authentication failed. Please log in again.");
          // Handle redirect / token clear if needed
        }
      }
    }
  };

  // Handler for the checkbox change (to mark complete/incomplete)
  const handleToggleComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token, "Content-Type": "application/json" },
      };
      const body = JSON.stringify({ isCompleted: !task.isCompleted }); // Send the opposite status

      // Send PUT request to update the task
      const res = await axios.put(
        `http://localhost:5005/api/tasks/${task._id}`,
        body,
        config
      );

      // Call the prop function to update the task in the parent state
      onTaskCompleted(res.data); // Send the full updated task back
    } catch (err) {
      console.error(
        "Update task completion error:",
        err.response ? err.response.data : err
      );
      alert("Failed to update task status. Please try again.");
      if (err.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
        // Handle redirect / token clear if needed
      }
    }
  };

  // Format the deadline date for better readability
  const formattedDeadline = new Date(task.deadline).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <li
      style={{
        marginBottom: "15px",
        padding: "10px",
        border: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: task.isCompleted ? "#f0f0f0" : "#fff", // Grey out if completed
        textDecoration: task.isCompleted ? "line-through" : "none", // Strikethrough if completed
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={handleToggleComplete}
          style={{ marginRight: "10px" }}
        />
        <span>
          <strong>{task.description}</strong> <br />
          <small>Deadline: {formattedDeadline}</small>
        </span>
      </div>
      <button
        onClick={handleDelete}
        style={{
          color: "red",
          cursor: "pointer",
          border: "none",
          background: "none",
        }}
      >
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
