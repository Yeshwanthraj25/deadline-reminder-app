// day 5
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); // Import the middleware
const Task = require("../models/Task"); // Import Task model
const { check, validationResult } = require("express-validator"); // Optional: for input validation

// --- ROUTE 1: Get All Tasks for Logged-in User ---
// @route   GET api/tasks
// @desc    Get all tasks for the logged-in user
// @access  Private (requires token via authMiddleware)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Find tasks where the 'user' field matches the id from the decoded token (added by middleware)
    // Sort by deadline, ascending (nearest deadline first)
    const tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 });
    res.json(tasks); // Send the found tasks back as JSON
  } catch (err) {
    console.error("Get Tasks Error:", err.message);
    res.status(500).send("Server Error");
  }
});

// --- ROUTE 2: Create a New Task ---
// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  "/",
  [
    // Brackets denote an array of middleware
    authMiddleware, // First, ensure user is logged in
    [
      // Optional: Input validation using express-validator
      check("description", "Description is required").not().isEmpty(),
      check("deadline", "Deadline is required").not().isEmpty(),
      check("deadline", "Deadline must be a valid date").isISO8601().toDate(), // Ensure it's a valid date format
    ],
  ],
  async (req, res) => {
    // Check for validation errors (if using express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { description, deadline } = req.body; // Get data from request body

    try {
      // Create a new Task document in memory
      const newTask = new Task({
        description: description,
        deadline: deadline,
        user: req.user.id, // Associate task with the logged-in user's ID from the token
      });

      // Save the task to the database
      const task = await newTask.save();

      res.status(201).json(task); // Return the newly created task (201 Created status)
    } catch (err) {
      console.error("Create Task Error:", err.message);
      res.status(500).send("Server Error");
    }
  }
);

// --- ROUTE 3: Delete a Task ---
// @route   DELETE api/tasks/:taskId
// @desc    Delete a specific task by its ID
// @access  Private
router.delete("/:taskId", authMiddleware, async (req, res) => {
  try {
    // Find the task by ID from the URL parameter (req.params.taskId)
    let task = await Task.findById(req.params.taskId);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // IMPORTANT: Verify that the logged-in user owns this task
    // Convert task.user (ObjectId) to string for comparison
    if (task.user.toString() !== req.user.id) {
      // 401 Unauthorized - User doesn't own this task
      return res.status(401).json({ msg: "User not authorized" });
    }

    // If checks pass, remove the task from the database
    // Note: Mongoose v6+ uses task.deleteOne() or Task.findByIdAndDelete()
    await Task.findByIdAndDelete(req.params.taskId); // Simpler way

    res.json({ msg: "Task removed successfully" }); // Send success message
  } catch (err) {
    console.error("Delete Task Error:", err.message);
    // Handle potential error if the provided taskId isn't a valid MongoDB ObjectId format
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ msg: "Task not found (Invalid ID format)" });
    }
    res.status(500).send("Server Error");
  }
});

// --- ROUTE 4: Update a Task (Example: Mark Complete) ---
// @route   PUT api/tasks/:taskId
// @desc    Update a task (e.g., mark as complete/incomplete)
// @access  Private
router.put("/:taskId", authMiddleware, async (req, res) => {
  // Expecting { "isCompleted": true } or { "isCompleted": false } in request body
  const { isCompleted } = req.body;

  // Basic check if isCompleted was provided and is a boolean
  if (typeof isCompleted !== "boolean") {
    return res.status(400).json({
      msg: "Invalid update data: isCompleted (boolean) missing or incorrect type.",
    });
  }

  try {
    let task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Verify ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Find the task by ID and update its isCompleted field
    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { $set: { isCompleted: isCompleted } }, // Use $set to update specific field
      { new: true } // Option to return the *updated* document
    );
    res.json(task); // Return the updated task
  } catch (err) {
    console.error("Update Task Error:", err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ msg: "Task not found (Invalid ID format)" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
