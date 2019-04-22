const models = require("../../models");

function collectionAsFeature(collection) {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [collection["lon"], collection["lat"]]
    },
    properties: {
      collectionId: collection["collectionId"],
      collectionName: collection["collectionName"],
      tier: collection["tier"]
    }
  };
}

function collectionsAsFeatureCollection(collections) {
  let featureCollection = {
    type: "FeatureCollection",
    features: []
  };

  collections.forEach((collection) => {
    featureCollection.features.push(collectionAsFeature(collection));
  });

  return featureCollection;
}

module.exports.index = function(req, res) {
  let options = new Object();
  if ("columns" in req.query) {
    options["attributes"] = req.query["columns"].split(",");
    delete req.query["columns"];
  }
  if ("institutionId" in req.query) {
    options["where"] = { institutionId: req.query["institutionId"] };
    delete req.query["institutionId"];
  }

  let asGeojson = false;
  if("geojson" in req.query) {
    asGeojson = req.query["geojson"] == "true";
    delete req.query["geojson"];
  }

  // Any other query parameters are invalid
  if (Object.keys(req.query).length > 0) {
    res.sendStatus(400);
  } else {
    models.collections.findAll(options)
      .then((collections) => {
        if (asGeojson) {
          res.json(collectionsAsFeatureCollection(collections));
        } else {
          res.json(collections);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(400);
      });
  }
};

module.exports.byId = function(req, res) {
  let options = new Object();
  if ("columns" in req.query) {
    options["attributes"] = req.query["columns"].split(",");
    delete req.query["columns"];
  }

  // Any other query parameters are invalid
  if (Object.keys(req.query).length > 0) {
    res.sendStatus(400);
  } else {
    models.collections.findByPk(req.params["collectionId"], options)
      .then((collection) => {
        res.json(collection);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(400);
      });
  }
};
