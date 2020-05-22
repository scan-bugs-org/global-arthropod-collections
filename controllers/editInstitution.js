const Router = require("express").Router;
const database = require("../include/database");
const Institution = database.Institution;
const Collection = database.Collection;
const doError = require("../include/common").doError;

const router = Router();
const backUrl = "../?tab=institutions";

router.get("/:institutionId", async (req, res) => {
  const promises = [
    Institution.findById(req.params.institutionId),
    Collection.find(
      { institution: { _id: req.params.institutionId } },
      { _id: 1, name: 1 },
      { sort: "name" }
    )
  ];

  try {
    const [institution, collections] = await Promise.all(promises);
    if (institution === null) {
      doError(res, "Institution not found", backUrl);
    } else {
      res.render(
        "editInstitution.nunjucks",
        {
          institution: institution,
          collections: collections,
          backUrl: "../?tab=institutions"
        }
      );
    }
  } catch (err) {
    doError(res, err.reason, backUrl);
  }
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

router.post("/delete/:institutionId", async (req, res) => {
  try {
    const institution = await Institution.deleteOne({ _id: req.params.institutionId });
    if (institution === null || institution.deletedCount === 0) {
      doError(res, "Collection not found", `../${backUrl}`);
    } else {
      res.redirect(303, "../../?tab=institutions");
    }
  } catch (e) {
    doError(res, e.message, `../${backUrl}`);
  }
});


router.get("/", (req, res) => {
  res.render(
    "editInstitution.nunjucks",
    {
      institution: null,
      collections: [],
      backUrl: "../?tab=institutions"
    }
  );
});

module.exports = router;