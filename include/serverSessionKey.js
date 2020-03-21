const fs = require("fs");
const uuid = require("uuid");

module.exports = function(sessionKeyPath) {
  const keyExists = fs.existsSync(sessionKeyPath);
  let sessionKey;

  if (keyExists) {
    sessionKey = fs.readFileSync(sessionKeyPath);
  } else {
    sessionKey = uuid.v4();
    fs.writeFileSync(sessionKeyPath, sessionKey, { mode: 0o600 });
  }

  return sessionKey.toString("hex");
};