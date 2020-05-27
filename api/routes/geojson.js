const Utils = require("../Utils");

const GEOJSON_PROJECTION = {
  _id: 1,
  name: 1,
  institution: 1,
  url: 1,
  tier: 1
};

async function getGeoJson(req, res) {
  const mongo = await Utils.mongoConnect();
  const Collection = mongo.model("Collection");
  const tier = Number.parseInt(req.query.tier);

  if (Number.isNaN(tier)) {
    res.status(400);
    res.json({ errors: [{ message: "'tier' must be specified" }] });
  } else {
    const collections = await Collection.find({ tier }, GEOJSON_PROJECTION)
      .populate("institution", "name")
      .exec();
    res.json(collections.map((c) => c.asGeoJson()));
  }
}

module.exports = getGeoJson;