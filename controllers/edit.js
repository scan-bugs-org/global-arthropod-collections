const Router = require("express").Router;
const database = require("../include/database");
const Collection = database.Collection;
const Institution = database.Institution;

const batchUploadRouter = require("./batchUpload");
const collectionRouter = require("./editCollection");
const institutionRouter = require("./editInstitution");
const doError = require("../include/common").doError;

const router = new Router();

function collectionCmp(first, second) {
  const firstInstitutionName = (
    first.institution && first.institution.name ? first.institution.name.toLowerCase() : ''
  );
  const secondInstitutionName = (
    second.institution && second.institution.name ? second.institution.name.toLowerCase() : ''
  );

  const firstName = first.name.toLowerCase();
  const secondName = second.name.toLowerCase();

  // Sort by institution name
  if (firstInstitutionName < secondInstitutionName) {
    return -1;
  }

  if (firstInstitutionName > secondInstitutionName) {
    return 1;
  }

  // Then by name
  if (firstName < secondName) {
    return -1;
  }

  if (firstName > secondName) {
    return 1;
  }

  return 0;
}

router.use("/collections", collectionRouter);
router.use("/institutions", institutionRouter);
router.use("/upload", batchUploadRouter);

router.get("/", async (req, res) => {
  try {
    const collectionsPromise = await Collection.find(
      null,
      { _id: 1, name: 1, institution: 1 },
      { sort: "name" }
    ).populate("institution", { "_id": 1, "name": 1 });

    const institutionsPromise = await Institution.find(
      null,
      { _id: 1, name: 1 },
      { sort: "name" }
    );

    let [collections, institutions] = await Promise.all(
      [collectionsPromise, institutionsPromise]
    );

    collections = collections.sort(collectionCmp);
    collections = collections.map(c => {
      const asJSON = c.toJSON();
      const institution = asJSON.institution;
      const id = asJSON._id;
      const name = asJSON.name;

      asJSON.name = `<a href="./edit/collections/${id}">${name}</a>`;

      if (institution && institution.name) {
        asJSON.institution = `<a href="./edit/institutions/${institution._id}">`;
        asJSON.institution += `${institution.name}</a>`;
      } else {
        asJSON.institution = "";
      }

      return asJSON;
    });

    institutions = institutions.map(i => {
      const asJSON = i.toJSON();
      asJSON.name = `<a href="./edit/institutions/${asJSON._id}">${asJSON.name}</a>`;
      return asJSON;
    });

    res.render(
      "listPage.nunjucks",
      {
        serverRoot: "..",
        collectionHeaders: [
          { displayName: "ID", dbName: "_id" },
          { displayName: "Institution", dbName: "institution" },
          { displayName: "Name", dbName: "name" }
        ],
        institutionHeaders: [
          { displayName: "ID", dbName: "_id" },
          { displayName: "Name", dbName: "name" }
        ],
        collections: collections,
        institutions: institutions
      }
    );
  } catch (e) {
    console.error(`Error displaying list: ${e.message}`);
    console.error(e.stack);
    doError(res, e.message, "..");
  }
});

module.exports = router;
