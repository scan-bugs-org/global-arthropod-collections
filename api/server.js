const express = require("express");
const graphqlHTTP = require("express-graphql");
const logger = require("morgan");

const checkContentType = require("./middlewares/checkContentType");
const defaultRoute = require("./routes/default");
const geojsonRoute = require("./routes/geojson");
const graphQLSchema = require("./graphql/schema");
const Utils = require("./Utils");

const isDev = process.env.NODE_ENV === "development";
const port = process.env.PORT || 4000;

const app = express();

// Configure express app
app.disable("x-powered-by");
app.use(logger(isDev ? "dev" : "tiny"));
if (!isDev) {
    app.use(checkContentType);
}

// Configure routing
app.use("/api/geojson", geojsonRoute);
app.use("/api", graphqlHTTP({
    schema: graphQLSchema,
    graphiql: isDev,
}));
app.use("*", defaultRoute);

// Run express app
app.listen(port, () => console.log(`Server running on port ${port}...`));
