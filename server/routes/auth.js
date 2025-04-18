// server/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import user model
require("dotenv").config(); // To access JWT_SECRET from .env

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public (anyone can access this route)
router.post("/register", async (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  // Input validation (basic check)
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }

  try {
    // 1. Check if a user with this email already exists in the database
    let user = await User.findOne({ email: email });
    if (user) {
      // If user exists, send back a 400 Bad Request status and an error message
      return res.status(400).json({ msg: "User already exists" });
    }

    // 2. If user doesn't exist, create a new User instance (not saved yet)
    user = new User({
      email: email,
      password: password, // Plain password for now, hash next
    });

    // 3. Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt (randomness)
    user.password = await bcrypt.hash(password, salt); // Hash the password with the salt

    // 4. Save the new user (with hashed password) to the database
    await user.save();

    // 5. User registered, now create a JWT for immediate login
    const payload = {
      user: {
        id: user.id, // Use the user's unique MongoDB ID (_id, accessed via .id)
      },
    };

    // 6. Sign the token with your secret key
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Get the secret from .env
      { expiresIn: "10h" }, // Token options: expires in 10 hours (e.g., 36000)
      (err, token) => {
        if (err) throw err; // If signing fails, throw error
        // 7. Send the generated token back to the client (usually stored in localStorage)
        res.status(201).json({ token }); // 201 Created status
      }
    );
  } catch (err) {
    // Catch any server errors during the process
    console.error("Register Error:", err.message);
    res.status(500).send("Server error during registration");
  }
});

// @route   POST api/auth/login
// @desc    Authenticate (log in) an existing user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }

  try {
    // 1. Check if a user with the submitted email exists
    let user = await User.findOne({ email });
    if (!user) {
      // If user not found, send generic "Invalid Credentials" for security
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // 2. Compare the submitted password with the hashed password stored in the database
    // bcrypt.compare handles the salt automatically
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // If passwords don't match, send generic "Invalid Credentials"
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // 3. Passwords match! User is valid. Create JWT payload.
    const payload = {
      user: {
        id: user.id,
      },
    };

    // 4. Sign and return the JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10h" }, // Consistent expiration time
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back (status 200 OK is default)
      }
    );
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send("Server error during login");
  }
});

// Export the router so it can be used in server.js
module.exports = router;
