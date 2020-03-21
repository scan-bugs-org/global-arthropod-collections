function doError(res, err, backUrl="..") {
  res.render(
    "errorPage.nunjucks",
    { error: err, backUrl: backUrl }
  );
}

module.exports = {
  doError: doError
};