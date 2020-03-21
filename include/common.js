function doError(res, err, backUrl="..") {
  res.render(
    "errorPage.nunjucks",
    { error: err, backUrl: backUrl }
  );
}

function protectRoute(req, res, next) {
  if ("uid" in req.session) {
    next();
  } else {
    res.redirect(`/login?redir=${encodeURIComponent(req.originalUrl)}`);
  }
}

module.exports = {
  doError: doError,
  protectRoute: protectRoute
};