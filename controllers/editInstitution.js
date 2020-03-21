const Router = require("express").Router;
const database = require("../include/database");
const Institution = database.Institution;
const doError = require("./common").doError;

const router = Router();

router.get("/:institutionId", (req, res) => {
  Institution.findById(req.params.institutionId).then((institution) => {
    if (institution === null) {
      doError(res, "Institution not found", "../?tab=institutions");
    } else {
      res.render(
        "institutionEditor.nunjucks",
        { institution: institution, backUrl: "../?tab=institutions" }
      );
    }
  }).catch((err) => {
    doError(res, err.reason, "../?tab=institutions");
  });
});

module.exports = router;