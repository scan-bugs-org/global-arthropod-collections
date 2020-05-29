const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// 2-3 hashes/sec
const saltRounds = 12;

function setPassword(plainTextStr) {
  return bcrypt.hashSync(plainTextStr, saltRounds);
}

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    alias: "username"
  },
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