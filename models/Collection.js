const mongoose = require("mongoose");

const CollectionSchema = mongoose.Schema({
  code: String,
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution"
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
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
    required: true
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
      name: name,
      url: this.url,
      tier: this.tier
    }
  };
};

module.exports = CollectionSchema;