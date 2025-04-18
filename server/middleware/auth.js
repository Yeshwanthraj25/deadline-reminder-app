// day 5
const jwt = require("jsonwebtoken");
require("dotenv").config(); // To access JWT_SECRET

// Middleware function definition
module.exports = function (req, res, next) {
  // 1. Get token from request header
  // We expect the token to be sent in a header named 'x-auth-token'
  const token = req.header("x-auth-token");

  // 2. Check if no token exists
  if (!token) {
    // 401 Unauthorized - No credentials provided
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // 3. Verify the token if it exists
  try {
    // jwt.verify() checks if the token is valid and not expired using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If verification is successful, 'decoded' contains the payload we originally put in
    // (which includes the user object with the id)
    // We add this decoded user info to the request object ('req')
    // so that subsequent route handlers can access it (e.g., req.user.id)
    req.user = decoded.user;

    // Call next() to pass control to the next middleware function
    // or the actual route handler in the stack
    next();
  } catch (err) {
    // If jwt.verify() fails (invalid token, expired token), it throws an error
    console.error("Token verification failed:", err.message);
    // 401 Unauthorized - Invalid credentials
    res.status(401).json({ msg: "Token is not valid" });
  }
};
