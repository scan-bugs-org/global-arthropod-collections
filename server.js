#!/usr/bin/env/node

const express = require("express");
const logger = require("morgan");
const path = require("path");
const http = require("http");
const util = require("util");

const apiRouter = require("./routes/api/api");
const indexRouter = require("./routes/index");
const models = require("./models");

const NODE_ENV = process.env["NODE_ENV"] || "development";
const PORT = process.env["PORT"] || 8080;

let app = express();
app.set("port", PORT);
app.set("projectRoot", __dirname);
app.use(logger(NODE_ENV == "development" ? "dev" : "tiny"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);

let server = http.createServer(app);
models.sequelize.sync().then(() => {
  server.listen(PORT);
  server.on("listening", () => {
    console.log(util.format("Server listening on port %d...", PORT));
  });
  server.on("error", console.error);
});
