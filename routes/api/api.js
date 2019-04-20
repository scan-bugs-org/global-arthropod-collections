const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");

const DB_PATH = path.normalize(
  path.join(__dirname, "..", "..", "data", "entomology_collections.sqlite3"),
  sqlite3.OPEN_READONLY
);

let router = express.Router();

router.get("/collections", (req, res) => {
    res.type("json");

    new Promise((resolve, reject) => {
      let db = new sqlite3.Database(DB_PATH, (err) => {
        if (err != null) {
          reject(err);
        }
      });

      db.all("SELECT * FROM collections;", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });

      db.close();

    }).then((result) => {
      res.send(JSON.stringify(result));
    }).catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });

});

router.get("/institutions", (req, res) => {
  res.type("json");
});

module.exports = router;
