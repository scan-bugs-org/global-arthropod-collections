const models = require("../../models");

function collectionAsFeature(collection) {
  return new Promise((resolve, reject) => {
    try {
      const coordinates = [collection.lon, collection.lat];
      const collectionCopy = Object.assign({}, collection);

      delete collectionCopy.lat;
      delete collectionCopy.lon;

      const feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coordinates
        },
        properties: collectionCopy
      };

      resolve(feature);

    } catch(err) {
      reject(err);
    }
  });
}

function collectionsAsFeatureCollection(collections) {
  return new Promise((resolve, reject) => {
    try {
      const featureResults = [];
      const featureCollection = {
        type: "FeatureCollection",
        features: []
      };

      for (let i = 0; i < collections.length; i++) {
        featureResults.push(collectionAsFeature(collections[i]));
      }

      Promise.all(featureResults)
        .then((results) => {
          featureCollection.features = results;
          resolve(featureCollection);
        })
        .catch((err) => {
          reject(err);
        });

    } catch(err) {
      reject(err);
    }

  });
}

module.exports.index = function(req, res) {
  const reqCopy = Object.assign({}, req);
  const options = { raw: true };

  if ("columns" in req.query) {
    options.attributes = req.query.columns.split(",");
    delete reqCopy.query.columns;
  }
  if ("institutionCode" in req.query) {
    options.where = { institutionCode: req.query.institutionCode };
    delete reqCopy.query.institutionCode;
  }

  let asGeojson = false;
  if("geojson" in req.query) {
    asGeojson = req.query.geojson == "true";
    delete reqCopy.query.geojson;

    // Always include the lat-lon for geoJSON
    if ("attributes" in options) {
      if (!options.attributes.includes("lat")) {
        options.attributes.push("lat");
      }
      if (!options.attributes.includes("lon")) {
        options.attributes.push("lon");
      }
    }
  }

  // Any other query parameters are invalid
  if (Object.keys(reqCopy.query).length > 0) {
    res.sendStatus(400);
  } else {
    models.collections.findAll(options)
      .then((collections) => {
        if (asGeojson) {
          return collectionsAsFeatureCollection(collections);
        } else {
          return new Promise((resolve) => { resolve(collections); });
        }
      })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(400);
      });
  }
};

module.exports.byId = function(req, res) {
  const reqCopy = Object.assign({}, req);
  const options = { raw: true };

  if ("columns" in req.query) {
    options.attributes = req.query.columns.split(",");
    delete reqCopy.query.columns;
  }

  let asGeojson = false;
  if("geojson" in req.query) {
    asGeojson = req.query.geojson == "true";
    delete reqCopy.query.geojson;

    // Always include the lat-lon for geoJSON
    if ("attributes" in options) {
      if (!options.attributes.includes("lat")) {
        options.attributes.push("lat");
      }
      if (!options.attributes.includes("lon")) {
        options.attributes.push("lon");
      }
    }
  }

  options.where = { institutionCode: req.params.institutionCode, collectionCode: req.params.collectionCode };

  // Any other query parameters are invalid
  if (Object.keys(reqCopy.query).length > 0) {
    res.sendStatus(400);
  } else {
    models.collections.findOne(options)
      .then((collection) => {
        if (asGeojson) {
          res.json(collectionAsFeature(collection));
        } else {
          res.json(collection);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(400);
      });
  }
};
