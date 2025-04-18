//day 5 task
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  // Field to link this task to a specific User document
  user: {
    type: mongoose.Schema.Types.ObjectId, // Special data type for MongoDB Object IDs
    ref: "User", // Establishes a reference to the 'User' model
  },
  description: {
    type: String,
    required: [true, "Please add a task description"], // Mandatory
  },
  deadline: {
    type: Date,
    required: [true, "Please add a deadline"], // Mandatory
  },
  isCompleted: {
    // Optional: To track completion status
    type: Boolean,
    default: false, // Default to not completed
  },
  createdAt: {
    // Automatically record when the task was created
    type: Date,
    default: Date.now,
  },
});

// Create and export the 'Task' model based on the TaskSchema
// Mongoose will create/use a collection named 'tasks' (lowercase, plural)
module.exports = mongoose.model("Task", TaskSchema);
