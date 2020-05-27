const morgan = require("morgan");
const strftime = require("strftime");

const RED = 31;
const YELLOW = 33;
const CYAN = 36;
const GREEN = 32;
const MAGENTA = 35;
const RESET = "\u001b[0m";

morgan.token("datetime", () => {
  const ts = strftime("[%F %T]");

  if (process.env.NODE_ENV !== "production") {
    return `\u001b[${MAGENTA}m${ts}${RESET}`;
  }

  return ts;
});

if (process.env.NODE_ENV !== "production") {
  morgan.token("status", (_, res) => {
    const status = res.statusCode;
    let color;

    if (status >= 500) {
      color = RED;
    } else if (status >= 400) {
      color = YELLOW;
    } else if (status >= 300) {
      color = CYAN;
    } else if (status >= 200) {
      color = GREEN;
    } else {
      color = 0;
    }

    return `\u001b[${color}m${status}${RESET}`;
  });
}

morgan.format("dev", ":datetime :method :url :status :response-time ms - :res[content-length]");
morgan.format("prod", ":datetime :method :url :status :res[content-length] - :response-time ms");

module.exports = morgan;
