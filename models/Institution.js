const mongoose = require("mongoose");

const institutionSchema = mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    unique: true
  },
});

module.exports = institutionSchema;