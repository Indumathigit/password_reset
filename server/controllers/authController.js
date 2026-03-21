var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var User = require("../models/User");

var sendResetEmail = async function(email, resetLink) {
  if (process.env.RESEND_API_KEY) {
    var { Resend } = require("resend");
    var resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset Your Password",
      html: "<p>Click the link below to reset your password.</p><a href='" + resetLink + "'>" + resetLink + "</a><p>This link expires in 1 hour.</p>"
    });
  } else {
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
  }
};

var register = async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  var hashed = await bcrypt.hash(password, 10);

  var newUser = new User({
    email: email,
    password: hashed
  });
  await newUser.save();

  res.json({ message: "Registration successful!" });
};

var login = async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "No account found with this email" });
  }

  var isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  res.json({ message: "Login successful!" });
};

var forgotPassword = async function(req, res) {
  var email = req.body.email;
  console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

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

  await sendResetEmail(email, resetLink);

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

module.exports = { register, login, forgotPassword, resetPassword };