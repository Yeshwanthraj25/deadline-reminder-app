// client/src/components/auth/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("Attempting login:", { email }); // Log attempt
      // ** NOTE: This request WILL FAIL until Day 3 backend exists **

      const res = await axios.post(
        "https://deadline-reminder-app.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Login response (will likely not run yet):", res.data);
      localStorage.setItem("token", res.data.token); // Store token
      navigate("/home"); // Redirect on "success"
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.msg ||
          "Login Failed (Endpoint likely missing or invalid credentials)"
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>{" "}
        {/* Add link */}
      </p>
    </div>
  );
};

export default Login;
