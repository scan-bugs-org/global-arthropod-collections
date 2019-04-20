const models = require("../../models");

module.exports.index = function(req, res) {
  models.institutions.findAll()
    .then((institutions) => {
      res.json(institutions);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports.byId = function(req, res) {
  models.institutions.findByPk(req.params["institutionId"])
    .then((institution) => {
      res.json(institution);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports.search = function(req, res) {
  models.institutions.findAll({ where: req.query })
    .then((institutions) => {
      res.json(institutions);
    })
    .catch((err) => {
      console.error(err);
      res.json([]);
    });
};
