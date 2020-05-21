const mongoose = require("mongoose");

module.exports = mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    unique: true
  },
});