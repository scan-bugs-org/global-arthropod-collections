const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  code: {
    type: String
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    index: true
  },
  name: {
    type: String,
    required: true,
    default: "Entomology Collection",
    index: true
  },
  size: {
    type: Number,
    required: true,
    default: 0
  },
  location: {
    country: String,
    state: String,
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  tier: {
    type: Number,
    required: true,
    default: 4
  },
  url: String,
  inIdigbio: Boolean,
  scan: {
    exists: Boolean,
    scanType: String
  },
  gbif: {
    exists: Boolean,
    date: Date
  }
});

CollectionSchema.methods.asGeoJson = function() {
  let name = this.name;
  if (this.institution !== null) {
    name = `${this.institution.name} ${this.name}`;
  }
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [this.location.lng, this.location.lat]
    },
    properties: {
      id: this._id,
      name: name,
      url: this.url,
      tier: this.tier
    }
  };
};

CollectionSchema.query.byInstitutionId = function(institutionId) {
  return this.where({ institution: institutionId });
};

module.exports = CollectionSchema;