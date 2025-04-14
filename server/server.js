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

// Define a route handler for GET requests to the root URL ('/')
app.get("/", (req, res) => {
  // req: Represents the incoming request from the client (browser)
  // res: Represents the response we will send back to the client
  res.send("Hello World! im yeshwanth ");
});

// Define the port number the server will listen on
const PORT = process.env.PORT || 5001;

// Start the server and make it listen for connections on the specified port
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
