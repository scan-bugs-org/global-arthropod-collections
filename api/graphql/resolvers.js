const GraphQLUtils = require("./GraphQLUtils");
const Utils = require("../Utils");

const Institution = Utils.model("Institution");
const Collection = Utils.model("Collection");

async function resolveInstitutionById(parentNode, { id }, _, info) {
  try {
    await Utils.mongoConnect();

    const projection = GraphQLUtils.getGraphQLProjectionKeys(
      info.fieldNodes[0].selectionSet.selections
    );

    return await Institution.findById(id, projection).lean().exec();

  } catch (e) {
    GraphQLUtils.handleError(`Error fetching institution with ID "${id}"`, e);
  }
}

async function resolveInstitutionForCollection(parentNode, { id }, _, info) {
  try {
    await Utils.mongoConnect();

    const projection = GraphQLUtils.getGraphQLProjectionKeys(
      info.fieldNodes[0].selectionSet.selections
    );

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

    const projection = GraphQLUtils.getGraphQLProjectionKeys(
      info.fieldNodes[0].selectionSet.selections
    );

    // Always include institution for linking purposes
    projection["institution"] = 1;

    return await Collection.findById(id, projection).lean().exec();

  } catch (e) {
    GraphQLUtils.handleError(`Error fetching collection with ID "${id}"`, e);
  }
}

async function resolveCollectionsForInstitution(parentNode, args, _, info) {
  try {
    await Utils.mongoConnect();

    const projection = GraphQLUtils.getGraphQLProjectionKeys(
      info.fieldNodes[0].selectionSet.selections
    );

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
  resolveInstitutionForCollection,
  resolveCollectionById,
  resolveCollectionsForInstitution
};