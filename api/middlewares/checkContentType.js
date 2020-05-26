function checkContentType(req, res, next) {
    if (req.header("Content-Type") && req.header("Content-Type").startsWith("application/json")) {
        next();
    } else {
        res.status(415);
        res.json({ errors: [{ message: "Invalid Content-Type" }] });
    }
}

module.exports = checkContentType;