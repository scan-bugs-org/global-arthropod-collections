const bodyParser = require("body-parser");
const cluster = require("cluster");
const os = require("os");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const logger = require("./logger");

const checkContentType = require("./middlewares/checkContentType");
const defaultRoute = require("./routes/default");
const geojsonRoute = require("./routes/geojson");
const authRoute = require("./routes/auth");
const graphQLSchema = require("./graphql/schema");

const numCPUs = os.cpus().length;
const isDev = process.env.NODE_ENV === "development";
const port = process.env.PORT || 4000;

function runMaster() {
    console.log(`Master process running at PID ${process.pid}`);

    for (let i = 0; i < numCPUs; i++) {
        console.log("Forking child process...");
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker process ${worker.process.pid} died`);
    });
}

function runWorker() {
    const app = express();

    // Configure express app
    app.disable("x-powered-by");
    app.use(logger(isDev ? "dev" : "prod"));
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
    app.listen(port, () => console.log(`[PID ${process.pid}] Server running on port ${port}...`));
}

// Run the app
if (cluster.isMaster && !isDev) {
    runMaster();
} else {
    runWorker();
}
