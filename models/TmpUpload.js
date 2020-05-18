const mongoose = require("mongoose");

const TmpUploadSchema = mongoose.Schema({
  data: Object,
  mapping: Object
});

module.exports = TmpUploadSchema;