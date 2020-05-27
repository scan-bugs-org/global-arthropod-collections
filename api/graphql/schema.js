const graphql = require("graphql");
const Resolvers = require("./resolvers");

let UserType;
let InstitutionType;
let LocationType;
let CollectionType;
let QueryType;

UserType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    username: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    password: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  }
});

InstitutionType = new graphql.GraphQLObjectType({
  name: "Institution",
  fields: () => ({
    _id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    code: { type: graphql.GraphQLString },
    collections: {
      type: graphql.GraphQLNonNull(graphql.GraphQLList(CollectionType)),
      resolve: Resolvers.resolveCollectionsForInstitution
    }
  })
});

LocationType = new graphql.GraphQLObjectType({
  name: "Location",
  fields: {
    state: { type: graphql.GraphQLString },
    country: { type: graphql.GraphQLString },
    lat: { type: graphql.GraphQLNonNull(graphql.GraphQLFloat) },
    lng: { type: graphql.GraphQLNonNull(graphql.GraphQLFloat) },
  }
});

CollectionType = new graphql.GraphQLObjectType({
  name: "Collection",
  fields: () => ({
    _id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    code: { type: graphql.GraphQLString },
    institution: {
      type: InstitutionType,
      resolve: Resolvers.resolveInstitutionForCollection
    },
    location: { type: graphql.GraphQLNonNull(LocationType) },
    tier: { type: graphql.GraphQLInt }
  })
});

QueryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    user: {
      type: UserType,
      args: {
        username: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: Resolvers.resolveUserByUsername
    },
    institution: {
      type: InstitutionType,
      args: {
        id: { type: graphql.GraphQLID }
      },
      resolve: Resolvers.resolveInstitutionById
    },
    institutions: {
      type: graphql.GraphQLNonNull(graphql.GraphQLList(InstitutionType)),
      args: {
        skip: {
          type: graphql.GraphQLInt,
          defaultValue: 0
        },
        limit: {
          type: graphql.GraphQLInt,
          defaultValue: 10
        }
      },
      resolve: Resolvers.resolveInstitutions
    },
    collection: {
      type: CollectionType,
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLID) },
        tier: { type: graphql.GraphQLInt },
      },
      resolve: Resolvers.resolveCollectionById
    },
    collections: {
      type: graphql.GraphQLNonNull(graphql.GraphQLList(CollectionType)),
      args: {
        skip: {
          type: graphql.GraphQLInt,
          defaultValue: 0
        },
        limit: {
          type: graphql.GraphQLInt,
          defaultValue: 10
        },
        tier: {
          type: graphql.GraphQLInt
        }
      },
      resolve: Resolvers.resolveCollections
    }
  }
});

module.exports = new graphql.GraphQLSchema({ query: QueryType });