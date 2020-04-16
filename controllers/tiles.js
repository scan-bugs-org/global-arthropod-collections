const geojsonvt = require("geojson-vt");
const Router = require("express").Router;
const Collection = require("../include/database").Collection;

const router = Router();
router.use("/:z.:x.:y", (req, res) => {
  const searchParams = {};

  if (req.query.tier) {
    const tierQuery = Number.parseInt(req.query.tier);
    if (!Number.isNaN(tierQuery)) {
      searchParams.tier = tierQuery;
    }
  }

  Collection.find(searchParams).populate("institution").then((results) => {
    const tierFeatures = [];
    results.forEach((r) => tierFeatures.push(r.asGeoJson()));
    const tierCollection = ({
      type: "FeatureCollection",
      features: tierFeatures
    });

    const tileIdx = geojsonvt(tierCollection);
    res.send(tileIdx.getTile(req.params.z, req.params.y, req.params.y));
  });
});

module.exports = router;