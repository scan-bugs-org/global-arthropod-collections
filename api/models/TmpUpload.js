const mongoose = require("mongoose");

const TmpUploadSchema = new mongoose.Schema({
  headers: [String],
  rows: [String],
  result: String
});

module.exports = TmpUploadSchema;