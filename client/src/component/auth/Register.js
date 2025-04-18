import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "", // For confirmation
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      console.log("Attempting to register:", { email }); // Log attempt
      // ** NOTE: This request WILL FAIL until Day 3 backend exists **
      const res = await axios.post(
        "https://deadline-reminder-app.onrender.com/api/auth/register",
        {
          email,
          password,
        }
      );

      console.log("Registration response (will likely not run yet):", res.data);
      localStorage.setItem("token", res.data.token); // Store token
      navigate("/home"); // Redirect on "success" (won't happen yet)
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      // Set error based on expected response structure (or generic error)
      setError(
        err.response?.data?.msg ||
          "Registration Failed (Endpoint likely missing)"
      );
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password (min 6 chars):</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link> {/* Add link */}
      </p>
    </div>
  );
};

export default Register;
