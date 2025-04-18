// client/src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";

import HomePage from "./pages/HomePage";
import "./App.css"; // Optional: for basic styling

// Helper component for basic protected route concept
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* Basic Navigation */}
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/home">Home</Link>
            </li>{" "}
            {/* Link to protected page */}
          </ul>
        </nav>
        <hr />
        <h1>Deadline Reminder App</h1>

        {/* Define Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* "Protected" Route */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />

          {/* Default Route Redirect */}
          {/* If user has token, go home, otherwise go to login */}
          <Route
            path="/"
            element={
              <Navigate
                to={localStorage.getItem("token") ? "/home" : "/login"}
              />
            }
          />

          {/* Catch-all for Not Found */}
          <Route
            path="*"
            element={
              <div>
                <h2>404 Not Found</h2>
                <Link to="/">Go Home</Link>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
