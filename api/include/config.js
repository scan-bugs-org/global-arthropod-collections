const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.resolve(__dirname, "..", "config.json");
module.exports = JSON.parse(fs.readFileSync(CONFIG_PATH).toString("utf-8"));
