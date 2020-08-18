const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const uuid = require("uuid");

// 2-3 hashes/sec
const saltRounds = 12;

function setPassword(plainTextStr) {
  return bcrypt.hashSync(plainTextStr, saltRounds);
}

function verifyPassword(plainTextStr) {
  return bcrypt.compareSync(plainTextStr, this.password);
}

const UserSchema = mongoose.Schema({
  _id: String,
  password: {
    type: String,
    required: true,
    set: setPassword
  }
});

UserSchema.methods.verifyPassword = verifyPassword;

module.exports = UserSchema;