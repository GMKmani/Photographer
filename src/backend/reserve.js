const express = require("express");
const { default: mongoose } = require("mongoose");
const Reserve = new mongoose.Schema({
  username1: {
    type: String,
  },

  email1: {
    type: String,
  },
  phone1: {
    type: String,
  },
  City: {
    type: String,
  },
  Event: {
    type: String,
  },
  date: {
    type: String,
  },
  photographername: {
    type: String,
  },
});
module.exports = new mongoose.model("Reserve", Reserve);
