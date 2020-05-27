const Utils = require("../Utils");

async function authRoute(req, res) {
  if (req.body.username && req.body.password) {
    const mongo = await Utils.mongoConnect();
    const User = mongo.model("User");

    const user = await User.findById(req.body.username);
    if (user !== null && await user.verifyPassword(req.body.password)) {
      res.sendStatus(204);
    } else {
      res.sendStatus(401);
    }

  } else {
    res.status(400);
    res.json({ errors: [{ message: "Must provide 'username' and 'password'" }] });
  }
}

module.exports = authRoute;