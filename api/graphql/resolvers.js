const GraphQLUtils = require("./GraphQLUtils");
const Utils = require("../Utils");

const Institution = Utils.model("Institution");
const Collection = Utils.model("Collection");

const LIMIT_MAX = 100;

function getCollectionProjection(info) {
  const [projection, children] = GraphQLUtils.getGraphQLProjectionKeys(info);

  // Include institution ID for linking purposes
  if (children.includes("institution")) {
    projection["institution"] = 1;
  }

  if (children.includes("location")) {
    projection["location"] = 1;
  }

  return projection;
}

async function resolveInstitutionById(parentNode, { id }, _, info) {
  try {
    await Utils.mongoConnect();

    const [projection,] = GraphQLUtils.getGraphQLProjectionKeys(info);
    return await Institution.findById(id, projection).lean().exec();

  } catch (e) {
    GraphQLUtils.handleError(`Error fetching institution with ID "${id}"`, e);
  }
}

async function resolveInstitutions(parentNode, { skip, limit }, _, info) {
  try {
    await Utils.mongoConnect();

    const [projection,] = GraphQLUtils.getGraphQLProjectionKeys(info);

    // Cap the maximum results
    if (limit > LIMIT_MAX) {
      limit = LIMIT_MAX;
    }

    return await Institution.find({}, projection, { limit, skip }).lean().exec();

  } catch (e) {
    GraphQLUtils.handleError("Error fetching institutions", e);
  }
}

async function resolveInstitutionForCollection(parentNode, { id }, _, info) {
  try {
    await Utils.mongoConnect();

    const [projection,] = GraphQLUtils.getGraphQLProjectionKeys(info);
    return await Institution.findById(parentNode.institution, projection)
      .lean()
      .exec();

  } catch (e) {
    GraphQLUtils.handleError(`Error fetching institution with ID "${id}"`, e);
  }
}

async function resolveCollectionById(parentNode, { id }, _, info) {
  try {
    await Utils.mongoConnect();

    const projection = getCollectionProjection(info);
    return await Collection.findById(id, projection).lean().exec();

  } catch (e) {
    GraphQLUtils.handleError(`Error fetching collection with ID "${id}"`, e);
  }
}

async function resolveCollections(parentNode, args, _, info) {
  try {
    await Utils.mongoConnect();

    const projection = getCollectionProjection(info);
    const selection = {};
    let { skip, limit } = args;

    // Cap the maximum results
    if (args.limit > LIMIT_MAX) {
      args.limit = LIMIT_MAX;
    }

    if (Object.keys(args).includes("tier")) {
      selection.tier = args.tier;
    }

    return await Collection.find(
      selection,
      projection,
      { skip, limit }
    ).lean().exec();

  } catch (e) {
    GraphQLUtils.handleError("Error fetching collections", e);
  }
}

async function resolveCollectionsForInstitution(parentNode, args, _, info) {
  try {
    await Utils.mongoConnect();

    const projection = getCollectionProjection(info);
    return await Collection.find({}, projection).byInstitutionId(parentNode._id)
      .lean()
      .exec();

  } catch (e) {
    GraphQLUtils.handleError(
      `Error fetching collections for institution ID "${parentNode._id}"`,
      e
    );
  }
}

module.exports = {
  resolveInstitutionById,
  resolveInstitutions,
  resolveInstitutionForCollection,
  resolveCollectionById,
  resolveCollections,
  resolveCollectionsForInstitution
};