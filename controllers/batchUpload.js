const Router = require("express").Router;
const multer = require("multer");
const database = require("../include/database");
const TmpUpload = database.TmpUpload;
const Institution = database.Institution;
const Collection = database.Collection;
const os = require("os");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

const TMP_DIR = path.join(os.tmpdir(), "global-arthropod-collections");

const INSTITUTION_MAPPING = {
  "Institution Code": "code",
  "Institution Name": "name",
};

const COLLECTION_MAPPING = {
  "Collection Code": "code",
  "Collection Name": "name",
  "Collection Size": "size",
  "Collection Tier": "tier",
  "Collection URL": "url",
  "Collection in SCAN?": "scan.exists",
  "Collection in GBIF?": "gbif.exists",
  "GBIF Date": "gbif.date",
  "Country": "location.country",
  "State/Province": "location.state",
  "Latitude": "location.lat",
  "Longitude": "location.lng",
};

const router = Router();
const upload = multer({ dest: TMP_DIR });

function fieldToNumber(fieldVal) {
  const asFloat = parseFloat(fieldVal);
  if (!isNaN(asFloat)) {
    if (asFloat % 10 === 0) {
      return parseInt(fieldVal);
    }
    return asFloat;
  }
  return fieldVal;
}

function fieldToBoolean(fieldVal) {
  if (fieldVal.toLowerCase() === "yes" || fieldVal.toLowerCase() === "true") {
    return true;
  }
  if (fieldVal.toLowerCase() === "no" || fieldVal.toLowerCase() === "false") {
    return false;
  }
  return fieldVal;
}

function parseField(fieldVal) {
  fieldVal = unescape(fieldVal.trim());
  const asNum = fieldToNumber(fieldVal);
  if (typeof asNum === "number") {
    return asNum;
  }
  return fieldToBoolean(fieldVal);
}

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { mode: 0o700 });
}

router.get("/:uploadId", async (req, res) => {
  const upload = await TmpUpload.findById(req.params.uploadId);

  res.render(
    "batchUploadMapping.nunjucks",
    {
      dbFields: Object.keys(INSTITUTION_MAPPING).concat(Object.keys(COLLECTION_MAPPING)),
      csvFields: upload.data.headers
    }
  );
});

router.post("/:uploadId", async (req, res) => {
  const upload = await TmpUpload.findById(req.params.uploadId);
  const mapping = req.body;

  const results = {
    "institutions": [],
    "collections": []
  };
  const promises = [];

  for (let i = 0; i < upload.data.rows.length; i++) {
    const row = upload.data.rows[i];
    const newInstitution = {};
    const newCollection = {};
    let dbInstitution;
    let dbCollection;

    Object.keys(INSTITUTION_MAPPING).forEach((k) => {
      const dbKey = INSTITUTION_MAPPING[k];
      const dbVal = row[mapping[k]];

      if (dbVal) {
        newInstitution[dbKey] = dbVal;
      }
    });

    dbInstitution = await Institution.findOneAndUpdate(
      { $or: [{code: newInstitution.code}, {name: newInstitution.name}] },
      newInstitution,
      { new: true, upsert: true }
    );

    await dbInstitution.save();
    results.institutions.push(dbInstitution.name);

    Object.keys(COLLECTION_MAPPING).forEach((k) => {
      const dbKey = COLLECTION_MAPPING[k];
      let dbVal = row[mapping[k]];
      if (dbVal) {
        dbVal = parseField(dbVal);
        if (dbKey.includes(".")) {
          const parts = dbKey.split(".");
          if (!Object.keys(newCollection).includes(parts[0])) {
            newCollection[parts[0]] = {};
          }
          newCollection[parts[0]][parts[1]] = dbVal;
        } else {
          newCollection[dbKey] = dbVal;
        }
      }
    });

    newCollection["institution"] = dbInstitution._id;
    dbCollection = await Collection.findOneAndUpdate(
      {
        $and: [{
          institution: newCollection._id,
          $or: [{code: newCollection.code}, {name: newCollection.name}]
        }]
      },
      newCollection,
      { new: true, upsert: true }
    );
    promises.push(dbCollection.save());
    results.collections.push(dbCollection.name);
  }

  promises.push(TmpUpload.deleteOne({ _id: req.params.uploadId }));
  await Promise.all(promises);

  req.session.results = results;
  res.redirect(303, `./complete/${req.params.uploadId}`)
});

router.get("/complete/:uploadId", (req, res) => {
  res.render("batchUploadComplete.nunjucks", {
    collections: req.session.results.collections,
    institutions: req.session.results.institutions
  });
  delete req.session.results;
});

router.get("/", (req, res) => {
  res.render("batchUpload.nunjucks");
});


router.post("/", upload.single("csv-upload"), (req, res) => {
  const newUpload = new TmpUpload();
  newUpload.data = {};
  newUpload.mapping = {};

  fs.createReadStream(req.file.path).pipe(csvParser())
    .on("headers", (headers) => {
      newUpload.data.headers = headers;
    })
    .on("data", (data) => {
      if (!newUpload.data.rows) {
        newUpload.data.rows = [];
      }
      newUpload.data.rows.push(data);
    })
    .on("end", async () => {
      await newUpload.save();
      await fs.promises.unlink(req.file.path);
      res.redirect(`${req.originalUrl}/${newUpload._id}`);
    });
});

module.exports = router;