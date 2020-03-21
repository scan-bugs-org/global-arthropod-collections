const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoSessionStore = require("connect-mongo")(session);

const InstitutionSchema = require("../models/Institution");
const CollectionSchema = require("../models/Collection");
const UserSchema = require("../models/User");

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

// Models
const InstitutionModel = mongoose.model("Institution", InstitutionSchema);
const CollectionModel = mongoose.model("Collection", CollectionSchema);
const UserModel = mongoose.model("User", UserSchema);

// Sessions
const mongoSessionStore = new MongoSessionStore({
  mongooseConnection: connection,
  ttl: 24 * 60 * 60,
  touchAfter: 3600
});

module.exports = {
  connection: connection,
  sessionStore: mongoSessionStore,
  Institution: InstitutionModel,
  Collection: CollectionModel,
  User: UserModel,
};