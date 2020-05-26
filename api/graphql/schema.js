const graphql = require("graphql");
const Resolvers = require("./resolvers");

let InstitutionType;
let CollectionType;
let QueryType;

CollectionType = new graphql.GraphQLObjectType({
  name: "Collection",
  fields: () => ({
    _id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    code: { type: graphql.GraphQLString },
    institution: {
      type: InstitutionType,
      resolve: Resolvers.resolveInstitutionForCollection
    }
  })
});

InstitutionType = new graphql.GraphQLObjectType({
  name: "Institution",
  fields: {
    _id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    code: { type: graphql.GraphQLString },
    collections: {
      type: graphql.GraphQLList(CollectionType),
      resolve: Resolvers.resolveCollectionsForInstitution
    }
  }
});

QueryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    institution: {
      type: InstitutionType,
      args: {
        id: { type: graphql.GraphQLID }
      },
      resolve: Resolvers.resolveInstitutionById
    },
    collection: {
      type: CollectionType,
      args: {
        id: { type: graphql.GraphQLID }
      },
      resolve: Resolvers.resolveCollectionById
    }
  }
});

module.exports = new graphql.GraphQLSchema({ query: QueryType });