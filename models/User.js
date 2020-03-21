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

function addSession() {
  const newSessionId = uuid.v4();
  this.sessions.push(newSessionId);
  return newSessionId;
}

const UserSchema = mongoose.Schema({
  _id: String,
  password: {
    type: String,
    required: true,
    set: setPassword
  },
  sessions: {
    type: [String],
    default: [],
    required: true
  }
});

UserSchema.methods.verifyPassword = verifyPassword;
UserSchema.methods.addSession = addSession;

module.exports = UserSchema;