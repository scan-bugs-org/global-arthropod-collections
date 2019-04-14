const express = require("express");
const logger = require("morgan");
const path = require("path");
const util = require("util");

const NODE_ENV = process.env["NODE_ENV"] || "development";
const PORT = process.env["PORT"] || 8080;

let app = express();
app.use(logger(NODE_ENV == "development" ? "dev" : "tiny"));
app.use(express.static(path.join(__dirname, "public")))

app.listen(PORT, () => {
  console.log(util.format("Server listening on port %d...", PORT))
});
