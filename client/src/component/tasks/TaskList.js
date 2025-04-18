//day5
import React from "react";
import TaskItem from "./TaskItem"; // We'll create this next

// Receives the list of tasks and functions to handle deletion/completion as props
const TaskList = ({ tasks = [], onTaskDeleted, onTaskCompleted }) => {
  if (tasks.length === 0) {
    return <p>No deadlines found. Add one above!</p>;
  }

  return (
    <div>
      <h3>Your Deadlines</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {/* Map over the tasks array */}
        {/* For each task object, render a TaskItem component */}
        {tasks.map((task) => (
          <TaskItem
            key={task._id} // Unique key for React lists
            task={task} // Pass the whole task object down
            onTaskDeleted={onTaskDeleted} // Pass the delete handler down
            onTaskCompleted={onTaskCompleted} // Pass the completion handler down
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
