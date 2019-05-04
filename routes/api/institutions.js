const models = require("../../models");

module.exports.index = function(req, res) {
  const options = new Object();
  const reqCopy = Object.assign({}, req);

  if ("columns" in req.query) {
    options.attributes = req.query.columns.split(",");
    delete reqCopy.query.columns;
  }

  // Any other query parameters are invalid
  if (Object.keys(reqCopy.query).length > 0) {
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
  const options = new Object();
  const reqCopy = Object.assign({}, req);

  if ("columns" in req.query) {
    options.attributes = req.query.columns.split(",");
    delete reqCopy.query.columns;
  }

  // Any other query parameters are invalid
  if (Object.keys(reqCopy.query).length > 0) {
    res.sendStatus(400);
  } else {
    models.institutions.findByPk(req.params.institutionId, options)
      .then((institution) => {
        res.json(institution);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(400);
      });
  }
};
