const express = require("express");
const { default: mongoose } = require("mongoose");
const ProfilesData = new mongoose.Schema({
  username: {
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
  Address: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
  },
});
module.exports = new mongoose.model("ProfilesData", ProfilesData);
