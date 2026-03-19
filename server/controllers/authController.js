var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var User = require("../models/User");

var forgotPassword = async function(req, res) {
  var email = req.body.email;

  var user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "No account found with this email" });
  }

  var token = crypto.randomBytes(32).toString("hex");

  var expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  var resetLink = process.env.CLIENT_URL + "/reset-password/" + token;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: "<p>Click the link below to reset your password.</p><a href='" + resetLink + "'>" + resetLink + "</a><p>This link expires in 1 hour.</p>"
  });

  res.json({ message: "Reset link sent to your email!" });
};

var resetPassword = async function(req, res) {
  var token = req.params.token;
  var newPassword = req.body.password;

  var user = await User.findOne({ resetToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid link" });
  }

  var now = new Date();
  if (now > user.resetTokenExpiry) {
    return res.status(400).json({ message: "Link has expired, please try again" });
  }

  var hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  user.resetToken = "";
  user.resetTokenExpiry = null;
  await user.save();

  res.json({ message: "Password updated successfully!" });
};

module.exports = { forgotPassword, resetPassword };