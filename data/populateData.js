const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");

const Institution = require("../include/database").Institution;
const Collection = require("../include/database").Collection;

const fileName = path.join(__dirname, "source.csv");
const rows = [];

function strToNull(str) {
  return (str === null || str === '' ? null : str);
}

function doCreateCollection(institutionId, row) {
  let gbifDate = row["gbifDate"].trim();
  if (gbifDate !== "") {
    let [d, m, y] = gbifDate.split('-');
    gbifDate = Date.parse([m, d, y].join('/'));
  } else {
    gbifDate = null;
  }

  const collectionData = {
    institution: institutionId,
    code: strToNull(row["collectionCode"]),
    name: strToNull(row["collectionName"]),
    size: Number.parseInt(row["collectionSize"]),
    tier: Number.parseInt(row["tier"]),
    url: strToNull(row["url"]),
    inIdigbio: row["idigbio"].toLowerCase() === "yes",
    scan: {
      exists: row["scan"].toLowerCase() === "yes",
      scanType: strToNull(row["scanType"])
    },
    gbif: {
      exists: row["gbif"].toLowerCase() === "yes",
      date: gbifDate
    },
    location: {
      country: strToNull(row["country"]),
      state: strToNull(row["state"]),
      lat: Number.parseFloat(row["lat"]),
      lng: Number.parseFloat(row["lng"])
    }
  };

  console.log(JSON.stringify(collectionData, null, 2));

  return new Promise((resolve, reject) => {
    const collection = new Collection(collectionData);
    collection.save().catch((err) => reject(err)).then(() => resolve());
  });
}

fs.createReadStream(fileName).pipe(csvParser({ strict: true })).on("data", (line) => {
  rows.push(line);
}).on("end", () => {
  const promises = [];

  rows.forEach((row) => {
    const institutionData = {
      code: strToNull(row["institutionCode"]),
      name: strToNull(row["institutionName"])
    };

    if (institutionData.code !== null || institutionData.name !== null) {
      const institution = new Institution(institutionData);
      promises.push(institution.save().then(() => {
        return doCreateCollection(institution._id, row)
      }).catch((err) => console.error(err)));
    } else {
      promises.push(doCreateCollection(null, row));
    }
    // console.log(JSON.stringify(institutionData, null, 2));
  });

  Promise.all(promises).then(() => {
    return process.exit();
  }).catch((err) => {
    console.error(err)
  });

}).on("error", (err) => {
  console.error(err);
});
