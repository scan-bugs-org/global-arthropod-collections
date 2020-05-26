const fs = require("fs");

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
}

Utils.CONFIG_FILE = "config.json";

module.exports = Utils;