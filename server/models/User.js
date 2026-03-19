 
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: "" },
  resetTokenExpiry: { type: Date, default: null }
});

var User = mongoose.model("User", userSchema);

module.exports = User;