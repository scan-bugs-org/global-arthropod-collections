const Router = require("express").Router;

const database = require("../include/database");
const doError = require("../include/common").doError;
const User = database.User;

const router = Router();

function loginFailed(req, res) {
  res.render("login.nunjucks", { redirUrl: req.body.redirUrl, error: "Login Failed" });
}

router.get("*", (req, res) => {
  const redirUrl = "redir" in req.query ? decodeURIComponent(req.query.redir) : "/";

  if ("sessionId" in req.session && "uid" in req.session) {
    res.redirect(redirUrl);
  } else {
    res.render("login.nunjucks", { redirUrl: redirUrl });
  }
});

router.post("*", (req, res, next) => {
  User.findById(req.body.username).then((user) => {
    // User not found
    if (user === null) {
      loginFailed(req, res);

    // Check password
    } else if (user.verifyPassword(req.body.password)) {
      req.session.uid = user._id;
      req.session.sessionId = user.addSession();
      Promise.all([user.save(), req.session.save()]).then(() => {
        req.session.save(() => {
          res.redirect(req.body.redirUrl);
        });
      });
    // Wrong password
    } else {
      loginFailed(req, res);
    }
  }).catch((err) => {
    doError(res, err, ".");
  });
});

module.exports = router;