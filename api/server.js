const express = require("express");
const graphql = require("graphql");
const graphqlHTTP = require("express-graphql");
const logger = require("morgan");

const checkContentType = require("./middlewares/checkContentType");
const Utils = require("./Utils");
const defaultRoute = require("./routes/default");

const isDev = process.env.NODE_ENV === "development";
const port = process.env.PORT || 4000;

const app = express();
const rootResolver = require("./resolver");

// Configure express app
app.use(logger(isDev ? "dev" : "tiny"));
if (!isDev) {
    app.use(checkContentType);
}
app.use("/api", graphqlHTTP({
    schema: Utils.loadSchema(),
    rootValue: rootResolver,
    graphiql: isDev
}));
app.use("*", defaultRoute);

// Run express app
app.listen(port, () => console.log(`Server running on port ${port}...`));
