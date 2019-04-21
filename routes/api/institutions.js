const models = require("../../models");

module.exports.index = function(req, res) {
  let options = new Object();
  if ("columns" in req.query) {
    options["attributes"] = req.query["columns"].split(",");
    delete req.query["columns"];
  }
  if ("collectionId" in req.query) {
    options["where"] = { collectionId: req.query["collectionId"] };
    delete req.query["collectionId"];
  }

  // Any other query parameters are invalid
  if (Object.keys(req.query).length > 0) {
    res.sendStatus(400);
  } else {
    models.institutions.findAll(options)
      .then((institutions) => {
        res.json(institutions);
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
    models.institutions.findByPk(req.params["institutionId"], options)
      .then((institution) => {
        res.json(institution);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(400);
      });
  }
};
