const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const models = require("../../models");

let router = express.Router();

router.get("/collections", (req, res) => {
    res.type("json");
    models.collections.findAll()
      .then((collections) => {
        res.send(JSON.stringify(collections));
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
});

router.get("/institutions", (req, res) => {
  res.type("json");
});

module.exports = router;
