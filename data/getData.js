const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");

const Institution = require("../include/database").Institution;
const Collection = require("../include/database").Collection;

const fileName = path.join(__dirname, "source.csv");

fs.createReadStream(fileName).pipe(csvParser()).on("data", (line) => {
  const institutionData = {
    code: line["institutionCode"],
    name: line["institutionName"]
  };
  const institution = new Institution(institutionData);
  institution.save()
    .catch((err) => {
      console.error(err.message);
    })
    .then(() => {
      const institutionId = institution._id;
      let gbifDate = line["gbifDate"].trim();
      if (gbifDate !== "") {
        let [d, m, y] = gbifDate.split('-');
        gbifDate = Date.parse([m, d, y].join('/'));

      } else {
        gbifDate = null;
      }
      const collectionData = {
        institution: institutionId,
        code: line["collectionCode"],
        name: line["collectionName"],
        size: Number.parseInt(line["collectionSize"]),
        tier: Number.parseInt(line["tier"]),
        url: line["url"],
        inIdigbio: line["idigbio"].toLowerCase() === "yes",
        scan: {
          exists: line["scan"].toLowerCase() === "yes",
          scanType: line["scanType"]
        },
        gbif: {
          exists: line["gbif"].toLowerCase() === "yes",
          date: gbifDate
        },
        location: {
          country: line["country"],
          state: line["state"],
          lat: Number.parseFloat(line["lat"]),
          lng: Number.parseFloat(line["lng"])
        }
      };

      const collection = new Collection(collectionData);
      return collection.save();

    }).catch((err) => {
      console.error(err.message);
    });
});
