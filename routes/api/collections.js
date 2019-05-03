const models = require("../../models");

function collectionAsFeature(collection, withInstitution=false) {
  return new Promise((resolve, reject) => {
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

    if (withInstitution) {
      delete feature.properties.institutionId;
      models.institutions.findByPk(collection.institutionId, { raw: true })
        .then((institution) => {
          feature.properties.institution = institution;
          resolve(feature);
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve(feature);
    }
  });
}

function collectionsAsFeatureCollection(collections, withInstitutions=false) {
  return new Promise((resolve, reject) => {

    const features = [];
    const featureCollection = {
      type: "FeatureCollection"
    };

    for (let i = 0; i < collections.length; i++) {
      features.push(collectionAsFeature(collections[i], withInstitutions));
    }

    Promise.all(features)
      .then((results) => {
        featureCollection.features = results;
        resolve(featureCollection);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports.index = function(req, res) {
  const reqCopy = Object.assign({}, req);
  const options = { raw: true };

  if ("columns" in req.query) {
    options["attributes"] = req.query["columns"].split(",");
    delete reqCopy.query["columns"];
  }
  if ("institutionId" in req.query) {
    options["where"] = { institutionId: req.query["institutionId"] };
    delete reqCopy.query["institutionId"];
  }

  let asGeojson = false;
  if("geojson" in req.query) {
    asGeojson = req.query["geojson"] == "true";
    delete reqCopy.query["geojson"];
  }

  let withInstitutions = false;
  if ("withInstitutions" in req.query) {
    withInstitutions = req.query["withInstitutions"] == "true";
    delete reqCopy.query["withInstitutions"];
  }

  // Any other query parameters are invalid
  if (Object.keys(reqCopy.query).length > 0) {
    res.sendStatus(400);
  } else {
    models.collections.findAll(options)
      .then((collections) => {
        if (asGeojson) {
          return collectionsAsFeatureCollection(collections, withInstitutions);
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
    options["attributes"] = req.query["columns"].split(",");
    delete reqCopy.query["columns"];
  }

  let asGeojson = false;
  if("geojson" in req.query) {
    asGeojson = req.query["geojson"] == "true";
    delete reqCopy.query["geojson"];
  }

  // Any other query parameters are invalid
  if (Object.keys(reqCopy.query).length > 0) {
    res.sendStatus(400);
  } else {
    models.collections.findByPk(req.params["collectionId"], options)
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
