require("dotenv").config();
//load the enviroment varialbe from .env file

const express = require("express");
// require is a inbuilt node used to import the library

const connectDB = require("./config/db");
//editing after setting up db file from config

connectDB();
//editted after db file
const app = express();

app.use(express.json());
//edited after db file(parsing incoming JSON format)

// Define a route handler for GET requests to the root URL ('/') day2
app.get("/", (req, res) => {
  // req: Represents the incoming request from the client (browser)
  // res: Represents the response we will send back to the client
  res.send("Hello World! im yeshwanth ");
});

// --- Define Routes ---day 3
app.use("/api/auth", require("./routes/auth"));

// Define the port number the server will listen on
const PORT = process.env.PORT || 5005;

// Start the server and make it listen for connections on the specified port day1np

// Add '0.0.0.0' as the second argument
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT} listening on 0.0.0.0`);
});
