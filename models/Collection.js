const mongoose = require("mongoose");
const InstitutionSchema = require("./Institution");

const CollectionSchema = mongoose.Schema({
  code: String,
  institution: InstitutionSchema,
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
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [this.location.lat, this.location.lng]
    },
    properties: {
      "name": this.name,
      "url": this.url,
    }
  };
};

module.exports = CollectionSchema;