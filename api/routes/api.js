const express = require("express");
const v1Router = require("./api/v1");

const router = express.Router();

// Check content type
router.use((req, res, next) => {
    const contentType = req.get("Content-Type");

    if (!contentType || !contentType.startsWith("application/json")) {
        res.status(415);
        res.json({ error: "Invalid Content-Type" });
    }
    else {
        next();
    }
});

// API v1
router.use("/v1", v1Router);

module.exports = router;