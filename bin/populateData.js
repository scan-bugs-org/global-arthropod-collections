const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");

const Institution = require("../include/database").Institution;
const Collection = require("../include/database").Collection;

const fileName = path.resolve(__dirname, "..", "data", "source.csv");
// const fileName = path.resolve(__dirname, "..", "data", "austrasia.csv");
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

function dateOrNull(str) {
  try {
    let [d, m, y] = str.trim().split('-');
    const date = Date.parse([m, d, y].join('/'));
    if (isNaN(date)) {
      return null;
    }
    return date;
  } catch (e) {
    return null;
  }
}

async function doCreateCollection(institutionId, row) {
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
      date: dateOrNull(row["gbifDate"])
    },
    location: {
      country: strToNull(row["country"]),
      state: strToNull(row["state"]),
      lat: floatOrDefault(row["lat"], 0),
      lng: floatOrDefault(row["lng"], 0)
    }
  };

  console.log(JSON.stringify(collectionData, null, 2));

  // Delete duplicates
  await Collection.deleteMany({ name: collectionData.name });

  const collection = new Collection(collectionData);
  return collection.save();
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

      // Delete duplicates
      promises.push(Institution.deleteMany(institutionData).then(() => {
        const institution = new Institution(institutionData);
        return institution.save();

      }).then((institution) => {
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
