const Router = require("express").Router;
const database = require("../include/database");
const Collection = database.Collection;
const Institution = database.Institution;

const router = new Router();

router.get("/", (req, res) => {
  const promises = [
    Collection.find(
      null,
      {_id: 1, name: 1, institution: 1},
      { sort: "name" }
    ).populate("institution", "name"),

    Institution.find(
      null,
      {_id: 1, name: 1},
      { sort: "name" }
    )
  ];

  Promise.all(promises).then(([collections, institutions]) => {
    collections = collections.map(c => {
      let institution = c.institution.name;
      let asObj = c.toObject();
      asObj.institution = institution;
      return asObj;
    });

    res.render(
      "listPage.nunjucks",
      {
        collectionHeaders: ["ID", "Institution", "Name"],
        institutionHeaders: ["ID", "Name"],
        collectionRows: collections,
        institutionRows: institutions.map(c => c.toObject())
      }
    );
  });
});

module.exports = router;
