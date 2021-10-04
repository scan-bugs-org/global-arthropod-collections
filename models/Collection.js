const mongoose = require("mongoose");

const CollectionSchema = mongoose.Schema({
  code: {
    type: String
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution"
  },
  name: {
    type: String,
    required: true,
    default: "Entomology Collection"
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
  let name = '';
  if (this.institution !== null && this.institution.name !== this.name) {
    name += this.institution.name + ' ';
  }
  name += this.name;
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

module.exports = CollectionSchema;
