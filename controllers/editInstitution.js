const Router = require("express").Router;
const database = require("../include/database");
const Institution = database.Institution;
const Collection = database.Collection;
const doError = require("./common").doError;

const router = Router();
const backUrl = "../?tab=institutions";

router.get("/:institutionId", (req, res) => {
  const promises = [
    Institution.findById(req.params.institutionId),
    Collection.find(
      { institution: { _id: req.params.institutionId } },
      { _id: 1, name: 1 },
      { sort: "name" }
    )
  ];

  Promise.all(promises).then(([institution, collections]) => {
    if (institution === null) {
      doError(res, "Institution not found", backUrl);
    } else {
      res.render(
        "institutionEditor.nunjucks",
        {
          institution: institution,
          collections: collections,
          backUrl: "../?tab=institutions"
        }
      );
    }
  }).catch((err) => {
    doError(res, err.reason, backUrl);
  });
});

router.post("/:institutionId", (req, res) => {
  const institutionObj = {
    name: req.body.institutionName,
    code: req.body.institutionCode
  };

  Institution.findByIdAndUpdate(req.params.institutionId, institutionObj).then((res) => {
    res.redirect(303, `./${req.params.institutionId}`);
  }).catch((err) => {
    doError(res, err.reason, backUrl);
  });
});



module.exports = router;