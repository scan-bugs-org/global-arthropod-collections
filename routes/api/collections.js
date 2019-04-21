const models = require("../../models");

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

  // Any other query parameters are invalid
  if (Object.keys(req.query).length > 0) {
    res.sendStatus(400);
  } else {
    models.collections.findAll(options)
      .then((collections) => {
        res.json(collections);
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
