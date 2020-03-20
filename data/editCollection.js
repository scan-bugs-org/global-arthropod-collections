const Router = require("express").Router;
const database = require("../include/database");
const Collection = database.Collection;
const Institution = database.Institution;

const router = Router();

function doError(req, res, err) {
  console.error(err);
  res.redirect("..");
}

router.get("/:collectionId", (req, res) => {
  const promises = [
    Collection.findById(req.params.collectionId).populate("institution", "name"),
    Institution.find(null, null, { sort: "name" })
  ];

  Promise.all(promises).then(([collection, institutions]) => {
    if (collection === null) {
      res.redirect("..");
    }
    console.log(JSON.stringify(collection, null, 2));
    res.render(
      "collectionEditor.nunjucks",
      { collection: collection, institutions: institutions }
    );
  }).catch((err) => {
    doError(req, res, err);
  });
});

router.all("*", (req, res) => {
  res.redirect("..");
});

module.exports = router;