const mongoose = require("mongoose");
const InstitutionSchema = require("../models/Institution");
const CollectionSchema = require("../models/Collection");

const user = "appUser";
const password = "password";
const host = "127.0.0.1";
const port = 27017;
const database = "globalCollections";

mongoose.connect(
  `mongodb://${user}:${password}@${host}:${port}/${database}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
).catch((err) => {
  console.error(`Error connecting to database: ${err.message}`);
});

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "MongoDB Error: "));

const InstitutionModel = mongoose.model("Institution", InstitutionSchema);
const CollectionModel = mongoose.model("Collection", CollectionSchema);

module.exports = {
  connection: connection,
  Institution: InstitutionModel,
  Collection: CollectionModel
};