const express = require("express");
// require is a inbuilt node used to import the library
const app = express();

// Define a route handler for GET requests to the root URL ('/')
app.get("/", (req, res) => {
  // req: Represents the incoming request from the client (browser)
  // res: Represents the response we will send back to the client
  res.send("Hello World! im yeshwanth ");
});

// Define the port number the server will listen on
const PORT = 5001; // A common port for development backend servers

// Start the server and make it listen for connections on the specified port
app.listen(PORT, () => {
  // This function runs once the server successfully starts
  console.log(`Server started successfully on port ${PORT}`);
});
