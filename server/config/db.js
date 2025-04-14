const mongoose = require("mongoose");

//load the enviroment varialbe from .env file

const connectDB = async () => {
  try {
    // console.log('MONGO_URI from env:', process.env.MONGO_URI);
    // attempting to connect the mongoDB url from .env file
    //await mongoose.connect('mongodb+srv://yeshwanthraj:deadlinereminder@cluster0.vapa5nh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MDB CONNECTEDD SUCESSFULY");
  } catch (err) {
    console.error("MDB connection error:", err.message);
    ////exit node.js
    process.exit(1);
  }
};
//export the function connectDB to used in other file
module.exports = connectDB;
