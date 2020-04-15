const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");

const Institution = require("../include/database").Institution;
const Collection = require("../include/database").Collection;

// const fileName = path.resolve(__dirname, "..", "data", "source.csv");
const fileName = path.resolve(__dirname, "..", "data", "austrasia.csv");
const rows = [];

function strToNull(str) {
  return (str === null || str === '' ? null : str);
}

function intOrDefault(str, defaultVal) {
  try {
    const asInt = Number.parseInt(str);
    if (isNaN(asInt)) {
      return defaultVal;
    }
    return asInt;
  } catch (e) {
    return defaultVal;
  }
}

function floatOrDefault(str, defaultVal) {
  try {
    const asFloat = Number.parseFloat(str);
    if (isNaN(asFloat)) {
      return defaultVal;
    }
    return asFloat;
  } catch (e) {
    return defaultVal;
  }
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
    size: intOrDefault(row["collectionSize"], 0),
    tier: intOrDefault(row["tier"], 4),
    url: row["url"] ? strToNull(row["url"]) : null,
    inIdigbio: row["idigbio"] && row["idigbio"].toLowerCase() === "yes",
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
      lat: floatOrDefault(row["lat"], 0),
      lng: floatOrDefault(row["lng"], 0)
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
