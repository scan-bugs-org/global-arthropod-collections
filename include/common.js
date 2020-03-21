const User = require("../include/database").User;

function doError(res, err, backUrl="..") {
  res.render(
    "errorPage.nunjucks",
    { error: err, backUrl: backUrl }
  );
}

function protectRoute(req, res, next) {
  if ("sessionId" in req.session && "uid" in req.session) {
    User.findById(req.session.uid, { _id: 0, sessions: 1 }).then((user) => {
      if (user !== null && user.sessions.includes(req.session.sessionId)) {
        next();
      } else {
        res.redirect(`/login?redir=${encodeURIComponent(req.originalUrl)}`);
      }
    }).catch((err) => {
      doError(res, err, req.originalUrl);
    });
  } else {
    res.redirect(`/login?redir=${encodeURIComponent(req.originalUrl)}`);
  }
}

module.exports = {
  doError: doError,
  protectRoute: protectRoute
};