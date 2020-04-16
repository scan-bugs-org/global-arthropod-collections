const Router = require("express").Router;
const Collection = require("../include/database").Collection;

const router = Router();
router.use("*", (req, res) => {
  const searchParams = {};

  if (req.query.tier) {
    const tierQuery = Number.parseInt(req.query.tier);
    if (!Number.isNaN(tierQuery)) {
      searchParams.tier = tierQuery;
    }
  }

  Collection.find(searchParams).populate("institution").then((results) => {
    const tierResults = [];
    results.forEach((r) => tierResults.push(r.asGeoJson()));
    res.json({
      type: "FeatureCollection",
      features: tierResults
    });
  });
});

module.exports = router;