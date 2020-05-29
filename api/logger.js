const strftime = require("strftime");

const RED = 31;
const GREEN = 32;
const YELLOW = 33;
const CYAN = 36;
const RESET = "\u001b[0m";
const MS_PER_SEC = 1000;
const NS_PER_MS = 1e6;

class Logger {
  static log(format, ...args) {
    const ts = strftime("[%F %T]");
    console.log(`${ts} ${format}`, ...args);
  }

  static middleware() {
    return function (req, res, next) {
      const startTime = process.hrtime();
      res.on("finish", () => {
        const resTime = process.hrtime(startTime);
        res.responseTime = Math.round(resTime[0] * MS_PER_SEC + resTime[1] / NS_PER_MS);
        Logger._middleware(req, res);
      });
      next();
    };
  }

  static _middleware(req, res) {
    let status = `${res.statusCode}`;

    // Color the status in dev mode
    if (process.env.NODE_ENV !== "production") {
      let color;

      // Server error
      if (res.statusCode >= 500) {
        color = `\u001b[${RED}m`;
      // Client error
      } else if (res.statusCode >= 400) {
        color = `\u001b[${YELLOW}m`;
      // Redirection
      } else if (res.statusCode >= 300) {
        color = `\u001b[${CYAN}m`;
      // OK
      } else {
        color = `\u001b[${GREEN}m`;
      }
      status = `${color}${status}${RESET}`;
    }

    const contentLength = `${res.get("Content-Length") ? res.get("Content-Length") : "-"}`;

    Logger.log(
        "%s %s %s %s - %d ms",
        req.method,
        req.originalUrl,
        status,
        contentLength,
        res.responseTime
    );
  }
}

module.exports = Logger;
