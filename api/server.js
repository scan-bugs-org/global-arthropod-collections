const bodyParser = require("body-parser");
const cluster = require("cluster");
const express = require("express");
const helmet = require("helmet");
const config = require("./include/config");
const { logger, loggerMiddleware } = require("./include/logger");

const apiRoute = require("./routes/api");
const defaultRoute = require("./routes/default");

// Configure app
const app = express();
app.use(loggerMiddleware());
app.use(bodyParser.json());
app.use(helmet());

// Configure routes
app.use("/api", apiRoute);
app.use(defaultRoute);

function runMaster() {
    for (let i = 0; i < config.app.processes; i++) {
        cluster.fork();
    }
}

function runWorker() {
    app.listen(config.app.port, () => {
        logger.info("Spawned process on port %d...", config.app.port);
    });
}

if (cluster.isMaster) {
    runMaster();
}
else {
    runWorker();
}