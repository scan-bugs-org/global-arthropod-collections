const Router = require("express").Router;
const database = require("../include/database");
const Collection = database.Collection;
const Institution = database.Institution;
const doError = require("../include/common").doError;

const router = Router();

router.get("/:collectionId", (req, res) => {
  const promises = [
    Collection.findById(req.params.collectionId).populate("institution", "name"),
    Institution.find(null, null, { sort: "name" })
  ];

  Promise.all(promises).then(([collection, institutions]) => {
    if (collection === null) {
      doError(res, "Collection not found");
    }
    res.render(
      "collectionEditor.nunjucks",
      {
        collection: collection,
        institutions: institutions.map(i => ({ name: i.name, value: i._id }))
      }
    );
  }).catch((err) => {
    doError(res, err.reason);
  });
});

router.post("/:collectionId", (req, res) => {
  const bodyObj = Object.assign({}, req.body);

  ["idigbio", "scan", "gbif"].forEach((k) => {
    if (bodyObj[k] !== "") {
      bodyObj[k] = bodyObj[k] === "Yes";
    }
  });

  ["size", "tier"].forEach((k) => {
    if (bodyObj[k] === "") {
      bodyObj[k] = null;
    } else {
      bodyObj[k] = Number.parseInt(bodyObj[k]);
    }
  });

  ["lat", "lng"].forEach((k) => {
    bodyObj[k] = Number.parseInt(bodyObj[k]);
  });

  const collectionObj = {
    name: bodyObj.collectionName.trim(),
    code: bodyObj.collectionCode.trim(),
    institution: bodyObj.institutionId,
    url: bodyObj.url.trim(),
    size: bodyObj.size,
    tier: bodyObj.tier,
    inIdigbio: bodyObj.idigbio,
    location: {
      lat: bodyObj.lat,
      lng: bodyObj.lng,
      country: bodyObj.country,
      state: bodyObj.state
    },
    scan: {
      exists: bodyObj.scan,
      scanType: bodyObj.scanType
    },
    gbif: {
      exists: bodyObj.gbif,
      date: new Date(bodyObj.gbifDate)
    }
  };

  Collection.findByIdAndUpdate(req.params.collectionId, collectionObj).then(() => {
    res.redirect(303, `./${req.params.collectionId}`);
  }).catch((err) => {
    doError(res, err.reason);
  })
});

router.all("*", (req, res) => {
  res.redirect("..");
});

module.exports = router;