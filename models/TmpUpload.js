const mongoose = require("mongoose");

const TmpUploadSchema = mongoose.Schema({
  data: Object,
});

module.exports = TmpUploadSchema;