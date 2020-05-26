const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// 2-3 hashes/sec
const saltRounds = 12;

async function setPassword(plainTextStr) {
  return await bcrypt.hash(plainTextStr, saltRounds);
}

const UserSchema = new mongoose.Schema({
  _id: String,
  password: {
    type: String,
    required: true,
    set: setPassword
  }
});

UserSchema.methods.verifyPassword = async function(plainTextStr) {
  return await bcrypt.compare(plainTextStr, this.password);
};

module.exports = UserSchema;