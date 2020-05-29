const bodyParser = require("body-parser");
const cluster = require("cluster");
const os = require("os");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const Logger = require("./logger");

const checkContentType = require("./middlewares/checkContentType");
const defaultRoute = require("./routes/default");
const geojsonRoute = require("./routes/geojson");
const authRoute = require("./routes/auth");
const graphQLSchema = require("./graphql/schema");

const numCPUs = os.cpus().length;
const isDev = process.env.NODE_ENV === "development";
const port = process.env.PORT || 4000;

function runMaster() {
    Logger.log(`Master process running at PID ${process.pid}`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    Logger.log(`Server running on port ${port}...`);

    cluster.on("exit", (worker) => {
        Logger.log(`Worker process with PID ${worker.process.pid} died`);
    });
}

function runWorker() {
    const app = express();

    // Configure express app
    app.disable("x-powered-by");
    app.use(Logger.middleware);
    app.use(bodyParser.json());
    if (!isDev) {
        app.use(checkContentType);
    }

    // Configure routing
    app.post("/auth", authRoute);
    app.use("/api/geojson", geojsonRoute);
    app.use("/api", graphqlHTTP({
        schema: graphQLSchema,
        graphiql: isDev,
    }));
    app.use("*", defaultRoute);

    // Run express app
    app.listen(port, () => Logger.log(`Worker spawned with PID ${process.pid}`));
}

// Run the app
if (cluster.isMaster && !isDev) {
    runMaster();
} else {
    runWorker();
}
