const Router = require("express").Router;
const Collection = require("../include/database").Collection;

const router = Router();
router.use("*", (req, res) => {
  Collection.find().then((results) => {
    const asGeoJson = [];
    results.forEach((r) => {
      asGeoJson.push(r.asGeoJson());
    });
    res.json(asGeoJson);
  });
});

module.exports = router;