function defaultRoute(req, res) {
  res.status(404);
  res.json({ errors: [{ message: "Page not found" }] });
}

module.exports = defaultRoute;