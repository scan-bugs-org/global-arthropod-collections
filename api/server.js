const express = require("express");
const graphqlHTTP = require("express-graphql");
const logger = require("morgan");
const {buildSchema} = require("graphql");

const checkContentType = require("./middlewares/checkContentType");
const Utils = require("./classes/Utils");
const defaultRoute = require("./routes/default");

const isDev = process.env.NODE_ENV === "development";
const port = process.env.PORT || 4000;

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    hello: () => {
        return "Hello world!";
    },
};

console.log(`Mongo URI is ${Utils.getMongoUri()}`);

const app = express();
app.use(logger(isDev ? "dev" : "tiny"));
if (!isDev) {
    app.use(checkContentType);
}
app.use("/api", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: isDev,
}));
app.use("*", defaultRoute);

app.listen(port, () => console.log(`Server running on port ${port}...`));
