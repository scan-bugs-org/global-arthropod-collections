const Utils = require("./Utils");

const Institution = Utils.model("Institution");
const Collection = Utils.model("Collection");

function handleError(msg, e) {
  console.error(`${msg}: ${e.message}`);
  throw e;
}

function getGraphQLProjectionKeys(projection, fields) {
  fields.forEach(field => {
    if (field.selectionSet) {
      projection[field.name.value] = {};
      getGraphQLProjectionKeys(projection[field.name.value], field.selectionSet.selections);
    } else {
      projection[field.name.value] = 1;
    }
  });
  return projection;
}

async function resolveInstitutionById({ id }, _, info) {
  try {
    await Utils.mongoConnect();

    let collectionProjection = null;
    let projectionObj = {};
    getGraphQLProjectionKeys(projectionObj, info.fieldNodes[0].selectionSet.selections);

    if (!Object.keys(projectionObj).includes("collections")) {
      projectionObj["_id"] = 0;
    }

    if (Object.keys(projectionObj).includes("collections")) {
      projectionObj["_id"] = 1;
      collectionProjection = projectionObj["collections"];
      delete projectionObj["collections"];
    }

    const institution = await Institution.findById(id, projectionObj).exec();
    if (institution !== null) {
      const asJSON = institution.toJSON();
      if (collectionProjection !== null) {
        asJSON.collections = await institution.getCollections(collectionProjection);
      }
      return asJSON;
    }
    return null;

  } catch (e) {
    handleError(`Error fetching institution with ID "${id}"`, e);
  }
}

async function resolveInstitutions({ skip, limit }, _, info) {
  try {
    await Utils.mongoConnect();

    const projection = getGraphQLProjectionKeys(info);
    const institutions = await Institution
      .find({}, projection, { skip, limit })
      .exec();

    if (institutions === null) {
      return [];
    }

    return institutions.map((i) => i.toJSON());
  } catch (e) {
    handleError("Error fetching institutions", e);
  }
}


module.exports = {
  institution: resolveInstitutionById,
  institutions: resolveInstitutions
};