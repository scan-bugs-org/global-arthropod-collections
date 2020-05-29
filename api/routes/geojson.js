const Utils = require("../Utils");

const GEOJSON_PROJECTION = {
  _id: 1,
  name: 1,
  institution: 1,
  "location.lng": 1,
  "location.lat": 1,
  url: 1,
  tier: 1
};

async function getGeoJson(req, res) {
  const mongo = await Utils.mongoConnect();
  const Collection = mongo.model("Collection");
  const tier = Number.parseInt(req.query.tier);

  if (Number.isNaN(tier)) {
    res.status(400);
    await res.json({ errors: [{ message: "'tier' must be specified" }] });

  } else {
    let collections = await Collection.find({ tier }, GEOJSON_PROJECTION)
      .populate("institution", "name")
      .exec();
    collections = collections.map((c) => c.asGeoJson());

    await res.json({
      type: "FeatureCollection",
      features: collections
    });
  }
}

module.exports = getGeoJson;