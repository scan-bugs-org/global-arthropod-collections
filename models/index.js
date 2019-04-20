"use strict";

const db = {};
const path = require("path");
const basename = path.basename(__filename);
const Sequelize = require("sequelize");

const DB_USER = null;
const DB_PASS = null;
const DB_PATH = path.normalize(
  path.join(basename, "..", "data", "entomology_collections.sqlite3")
);

const models = [
  "institutions.js",
  "collections.js"
];

let sequelize = new Sequelize("entomologyCollections", DB_USER, DB_PASS, {
  dialect: "sqlite",
  storage: DB_PATH
});

for (let i = 0; i < models.length; i++) {
  db[models[i].slice(0, -3)] = sequelize["import"](
    path.join(__dirname, models[i])
  );
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
