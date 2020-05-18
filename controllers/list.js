const Router = require("express").Router;
const database = require("../include/database");
const Collection = database.Collection;
const Institution = database.Institution;

const router = new Router();

function collectionNameCmp(first, second) {
  const firstInstitutionName = first.institution ? first.institution.toLowerCase() : '';
  const secondInstitutionName = second.institution ? second.institution.toLowerCase() : '';

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

router.get("/", async (req, res) => {
  let collections = await Collection.find(
    null,
    {_id: 1, name: 1, institution: 1},
    { sort: "name" }
  ).populate("institution", "name");

  let institutions = await Institution.find(
    null,
    {_id: 1, name: 1},
    { sort: "name" }
  );

  collections = collections.map(c => {
    let asObj = c.toObject();
    asObj.institution = c.institution.name;
    return asObj;
  });
  collections.sort(collectionNameCmp);

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
      collectionRows: collections,
      institutionRows: institutions.map(c => c.toObject())
    }
  );
});

module.exports = router;
