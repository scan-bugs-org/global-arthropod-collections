const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const nunjucks = require("nunjucks");
const path = require("path");
const geoJsonRouter = require("../data/geojson");

const PORT = 8080;
const isDev = process.env.NODE_ENV === "development";

// Configure app
const app = express();
app.use(logger(isDev ? "dev" : "tiny"));
app.use(bodyParser.json());

// Configure views
nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: isDev
});

app.use("/geojson", geoJsonRouter);

// Static files
app.use(express.static(path.resolve(__dirname, "..", "public")));

// Start app
app.listen(PORT, () => console.info(`Server listening on port ${PORT}...`));
