const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const nunjucks = require("nunjucks");
const nunjucksDateFilter = require("nunjucks-date-filter");
const path = require("path");

const geoJsonRouter = require("../controllers/geojson");
const listViewRouter = require("../controllers/list");
const collectionEditRouter = require("../controllers/editCollection");
const institutionEditRouter = require("../controllers/editInstitution");

const PORT = 8080;
const isDev = process.env.NODE_ENV === "development";

// Configure app
const app = express();
app.use(logger(isDev ? "dev" : "tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure views
const nunjucksEnv = nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: isDev
});
nunjucksEnv.addFilter("date", nunjucksDateFilter);

app.use("/geojson", geoJsonRouter);
app.use("/edit/collections", collectionEditRouter);
app.use("/edit/institutions", institutionEditRouter);
app.use("/edit", listViewRouter);

// Static files
app.use(express.static(path.resolve(__dirname, "..", "public")));

// Redirect to home on 404
app.use("*", (req, res) => res.redirect("/"));

// Start app
app.listen(PORT, () => console.info(`Server listening on port ${PORT}...`));
