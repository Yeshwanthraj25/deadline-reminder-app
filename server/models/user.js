const { models, default: mongoose } = require("mongoose");

//comes after db file and edited server file
const mongoose = reqire("mongoose");

const UserSchema = new mongoose.Schema({
  // schema is a blue print of that object datatype
  email: {
    type: String,
    required: true,
    unique: true, // no two user can use same email id
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

models.export = mongoose("User", UserSchema);
