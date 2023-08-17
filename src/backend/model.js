const express = require("express");
const { default: mongoose } = require("mongoose");
const UserRegistration = new mongoose.Schema({
  image: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  repassword: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});
module.exports = new mongoose.model("UserRegistration", UserRegistration);
