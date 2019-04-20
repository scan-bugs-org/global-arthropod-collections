const models = require("../../models");

module.exports.index = function(req, res) {
  models.collections.findAll()
    .then((collections) => {
      res.json(collections);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports.byId = function(req, res) {
  models.collections.findByPk(req.params["collectionId"])
    .then((collection) => {
      res.json(collection);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports.search = function(req, res) {
  models.collections.findAll({ where: req.query })
    .then((collections) => {
      res.json(collections);
    })
    .catch((err) => {
      console.error(err);
      res.json([]);
    });
};
