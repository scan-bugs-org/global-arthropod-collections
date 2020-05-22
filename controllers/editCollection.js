const Router = require("express").Router;
const database = require("../include/database");
const Collection = database.Collection;
const Institution = database.Institution;
const doError = require("../include/common").doError;

const router = Router();

async function getInstitutions() {
  let institutions = await Institution.find(null, { _id: 1, name: 1 }, { sort: "name" });
  institutions = institutions.map(i => ({ name: i.name, value: i._id }));
  institutions.unshift('');
  return institutions;
}

function convertFieldsToBool(bodyObj) {
  const newBodyObj = Object.assign({}, bodyObj);
  ["idigbio", "scan", "gbif"].forEach((k) => {
    if (bodyObj[k] !== "") {
      newBodyObj[k] = bodyObj[k] === "Yes";
    }
  });
  return newBodyObj;
}

function convertTierToNumber(bodyObj) {
  const newBodyObj = Object.assign({}, bodyObj);
  if (bodyObj["tier"] === "") {
    newBodyObj["tier"] = 4;
  } else {
    newBodyObj["tier"] = Number.parseInt(bodyObj["tier"]);
  }
  return newBodyObj;
}

function convertRequiredFieldsToNumbers(bodyObj) {
  const newBodyObj = Object.assign({}, bodyObj);
  newBodyObj["tier"] = Number.parseInt(bodyObj["tier"]);
  ["lat", "lng"].forEach((k) => {
    newBodyObj[k] = Number.parseFloat(bodyObj[k]);
  });
  return newBodyObj;
}

function createCollectionObj(req) {
  let bodyObj = Object.assign({}, req.body);
  bodyObj = convertFieldsToBool(bodyObj);
  bodyObj = convertTierToNumber(bodyObj);
  bodyObj = convertRequiredFieldsToNumbers(bodyObj);

  return {
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
      date: bodyObj.gbifDate ? new Date(bodyObj.gbifDate) : null
    }
  };
}

router.get("/:collectionId", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.collectionId).populate("institution", "name");
    const institutions = await getInstitutions();

    if (collection === null) {
      doError(res, "Collection not found");
    }
    res.render(
      "editCollection.nunjucks",
      {
        collection: collection,
        institutions: institutions
      }
    );
  } catch (err) {
    doError(res, err.reason);
  }
});

router.post("/:collectionId", async (req, res) => {
  try {
    const collectionObj = createCollectionObj(req);
    await Collection.findByIdAndUpdate(req.params.collectionId, collectionObj);

    res.redirect(303, req.originalUrl);

  } catch (err) {
    doError(res, err.reason);
  }
});

router.post("/delete/:collectionId", async (req, res) => {
  try {
    const collection = await Collection.deleteOne({ _id: req.params.collectionId });
    if (collection === null || collection.deletedCount === 0) {
      doError(res, "Collection not found");
    } else {
      res.redirect(303, "../../");
    }
  } catch (e) {
    doError(res, e.message, "../../");
  }
});

router.get("/", async (req, res) => {
  try {
    const institutions = await getInstitutions();
    res.render(
      "editCollection.nunjucks",
      {
        collection: null,
        institutions: institutions
      }
    );

  } catch (e) {
    doError(res, e);
  }
});

router.post("/", async (req, res) => {
  try {
    const collectionObj = createCollectionObj(req);
    const newCollection = new Collection(collectionObj);
    await newCollection.save();

    res.redirect(303, `${req.originalUrl}/${newCollection._id.toString()}`);

  } catch (err) {
    doError(res, err);
  }
});

router.all("*", (req, res) => {
  res.redirect("..");
});

module.exports = router;