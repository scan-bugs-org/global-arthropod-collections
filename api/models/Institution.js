const mongoose = require("mongoose");

async function deleteAssociatedCollections() {
  try {
    await this.model("Collection").deleteMany({ institution: this._id }).exec();
  } catch (e) {
    console.error(`Error deleting institution: ${e.message}`);
    throw e;
  }
}

const InstitutionSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    unique: true,
    index: true
  },
});

InstitutionSchema.pre(
  ["remove", "deleteOne"],
  { document: true, query: false },
  deleteAssociatedCollections
);

InstitutionSchema.methods.getCollections = async function(projection = {}) {
  if (!Object.keys(projection).includes("_id")) {
    projection["_id"] = 0;
  }

  const results = await this.model("Collection")
    .find({ institution: this._id }, projection)
    .lean()
    .exec();

  if (results === null) {
    return [];
  }
  return results;
};

module.exports = InstitutionSchema;