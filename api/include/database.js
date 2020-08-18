const mongoose = require("mongoose");
const { logger } = require("./logger");

const InstitutionSchema = require("../models/Institution");
const CollectionSchema = require("../models/Collection");
const UserSchema = require("../models/User");
const TmpUploadSchema = require("../models/TmpUpload");

const dbConfig = require("./config").database;

let dbUri = `mongodb://${ encodeURIComponent(dbConfig.user) }:`;
dbUri += `${ encodeURIComponent(dbConfig.password) }@`;
dbUri += `${ dbConfig.host }:${ dbConfig.port }/${ dbConfig.database }`;

const connectionOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

async function connect() {
    const connection = await mongoose.createConnection(dbUri, connectionOpts);
    connection.on("error", (err) => logger.error("Mongo error: %s", err));

    connection.model("Collection", CollectionSchema);
    connection.model("Institution", InstitutionSchema);
    connection.model("User", UserSchema);
    connection.model("TmpUpload", TmpUploadSchema);

    return connection;
}

module.exports = { connect };