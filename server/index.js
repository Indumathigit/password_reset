var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();

console.log("EMAIL_USER:", process.env.EMAIL_USER); // add this
var authRoutes = require("./routes/auth");

var app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", function(req, res) {
  res.json({ message: "Server is running!" });
});

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log("MongoDB connected");
  })
  .catch(function(err) {
    console.log("DB error", err);
  });

app.use("/api/auth", authRoutes);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Server running on port " + port);
});