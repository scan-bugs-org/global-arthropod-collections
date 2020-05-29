const fs = require("fs");
const mongoose = require("mongoose");
const os = require("os");

const UserSchema = require("./models/User");
const TmpUploadSchema = require("./models/TmpUpload");
const InstitutionSchema = require("./models/Institution");
const CollectionSchema = require("./models/Collection");

class Utils {
    static readFile(filePath) {
        return fs.readFileSync(filePath).toString("utf-8");
    }

    static getConfig() {
        return JSON.parse(Utils.readFile(Utils.CONFIG_FILE));
    }

    static getMongoUri() {
        const config = Utils.getConfig().database;
        let mongoUri = `mongodb://${encodeURIComponent(config.user)}:`;
        mongoUri +=  `${encodeURIComponent(config.password)}@`;
        mongoUri += `${encodeURIComponent(config.host)}:`;
        mongoUri += `${config.port}/`;
        mongoUri += `${encodeURIComponent(config.database)}`;

        return mongoUri;
    }

    static async mongoConnect() {
        let connection;

        const waitForConnect = mongoose.createConnection(
          Utils.getMongoUri(),
          {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true,
              poolSize: os.cpus().length
          }
        );

        connection = mongoose.connection;
        connection.on("error", console.error.bind(console, "MONGO ERROR: "));
        // connection.on("open", () => console.log("MONGO INFO: Connected"));

        connection.model("User", UserSchema);
        connection.model("TmpUpload", TmpUploadSchema);
        connection.model("Institution", InstitutionSchema);
        connection.model("Collection", CollectionSchema);

        return waitForConnect;
    }
}

Utils.CONFIG_FILE = "config.json";
Utils.GRAPHQL_SCHEMA_FILE = "schema.graphql";
Utils.UserModel = null;
Utils.TmpUploadModel = null;
Utils.InstitutionModel = null;
Utils.CollectionModel = null;

module.exports = Utils;