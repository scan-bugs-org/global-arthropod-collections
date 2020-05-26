const fs = require("fs");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

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
        const config = Utils.getConfig();
        let mongoUri = `mongodb://${encodeURIComponent(config.user)}:`;
        mongoUri +=  `${encodeURIComponent(config.password)}@`;
        mongoUri += `${encodeURIComponent(config.host)}:`;
        mongoUri += `${config.port}/`;
        mongoUri += `${encodeURIComponent(config.database)}`;

        return mongoUri;
    }

    static loadSchema() {
        return buildSchema(Utils.readFile(Utils.GRAPHQL_SCHEMA_FILE));
    }

    static async mongoConnect() {
        let connection;

        const waitForConnect = mongoose.connect(
          Utils.getMongoUri(),
          {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true
          }
        );

        connection = mongoose.connection;
        connection.on("error", console.error.bind(console, "MONGO ERROR: "));
        // connection.on("open", () => console.log("MONGO INFO: Connected"));

        await waitForConnect;
        return connection;
    }

    static model(modelName) {
        switch (modelName) {
            case "User":
                if (Utils.UserModel === null) {
                    Utils.UserModel = mongoose.model(modelName, UserSchema);
                }
                return Utils.UserModel;
            case "TmpUpload":
                if (Utils.TmpUploadModel === null) {
                    Utils.TmpUploadModel = mongoose.model(modelName, TmpUploadSchema);
                }
                return Utils.TmpUploadModel;
            case "Institution":
                if (Utils.InstitutionModel === null) {
                    Utils.InstitutionModel = mongoose.model(modelName, InstitutionSchema);
                }
                return Utils.InstitutionModel;
            case "Collection":
                if (Utils.CollectionModel === null) {
                    Utils.CollectionModel = mongoose.model(modelName, CollectionSchema);
                }
                return Utils.CollectionModel;
            default:
                throw new Error(`Model ${modelName} does not exist`);
        }
    }
}

Utils.CONFIG_FILE = "config.json";
Utils.GRAPHQL_SCHEMA_FILE = "schema.graphql";
Utils.UserModel = null;
Utils.TmpUploadModel = null;
Utils.InstitutionModel = null;
Utils.CollectionModel = null;

module.exports = Utils;