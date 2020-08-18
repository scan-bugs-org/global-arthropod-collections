const winston = require("winston");
const appConfig = require("./config").app;

function logFormatter({ level, message, label, timestamp }) {
    return `[${level.toUpperCase()}][${label.toUpperCase()}][${timestamp}] ${message}`;
}

const logger = winston.createLogger({
    level: appConfig.logLevel,
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    },
    format: winston.format.combine(
        winston.format.label({ label: `PID ${process.pid}` }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.splat(),
        winston.format.printf(logFormatter)
    ),
    transports: [new winston.transports.Console()]
});

function loggerMiddleware() {
    return (req, res, next) => {
        const startTime = Date.now();
        const host = req.get("x-forwarded-for") || req.socket.remoteAddress;

        res.on("finish", () => {
            const contentLength = res.getHeader("Content-Length");

            logger.info(
                "%s %s %s %d %d ms - %d",
                host,
                req.method,
                req.originalUrl,
                res.statusCode,
                Date.now() - startTime,
                contentLength ? contentLength : 0
            );
        });
        next();
    };
}

module.exports = {
    logger,
    loggerMiddleware
};