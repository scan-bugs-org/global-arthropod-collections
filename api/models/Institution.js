const mongoose = require("mongoose");

async function deleteAssociatedCollections() {
  try {
    await this.model("Collection").deleteMany({ institution: this._id });
  } catch (e) {
    console.error(`Error deleting institution: ${e.message}`);
    throw e;
  }
}

const InstitutionSchema = mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    unique: true
  },
});

InstitutionSchema.pre(
  ["remove", "deleteOne"],
  { document: true, query: false },
  deleteAssociatedCollections
);

module.exports = InstitutionSchema;