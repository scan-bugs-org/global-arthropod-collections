const express = require("express");
const logger = require("morgan");
const cluster = require("cluster");
const os = require("os");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 4001;
const numWorkers = os.cpus().length;

function runMaster() {
    console.log(`Master process running at PID ${process.pid}`);

    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }
    console.log(`Server running on port ${port}...`);

    cluster.on("exit", (worker) => {
        console.log(`Worker process with PID ${worker.process.pid} died`);
    });
}

function runWorker() {
    const app = express();
    app.use(logger(isDev ? "dev" : "tiny"));
    app.use(express.static(path.join(__dirname, "dist")));
    app.listen(port, () => console.log(`Spawned worker with PID ${process.pid}`));
}

// Run the app
if (cluster.isMaster && !isDev) {
    runMaster();
} else {
    runWorker();
}