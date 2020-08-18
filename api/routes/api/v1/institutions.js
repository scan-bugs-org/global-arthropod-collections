const express = require("express");
const database = require("../../../include/database");

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_OFFSET = 0;
const DEFAULT_PROJECTION = {
    _id: 1,
    code: 1,
    name: 1
};

const router = express.Router();

/**
 * GET /
 */
async function getIndexRoute(req, res) {
    const connection = await database.connect();
    const Institution = connection.model("Institution");

    const results = await Institution.find()
        .select(DEFAULT_PROJECTION)
        .limit(DEFAULT_LIMIT)
        .exec();

    return res.json(results);
}

/**
 * POST /
 */
async function postIndexRoute(req, res) {
    const connection = await database.connect();
    const Institution = connection.model("Institution");

    try {
        const results = await Institution.insertMany(req.body);
        return res.json(results);

    } catch (e) {
        res.status(500);
        res.json({ error: e.message });
    }
}

/**
 * GET /:id
 */
async function getIdRoute(req, res) {
    const connection = await database.connect();
    const Institution = connection.model("Institution");

    const result = await Institution.findById(req.params.id)
        .select(DEFAULT_PROJECTION)
        .exec();

    if (result) {
        return res.json(result);
    }
    else {
        res.status(404);
        res.json({ error: "Resource not found" });
    }
}

/**
 * PATCH /:id
 */
async function patchIdRoute(req, res) {
    const connection = await database.connect();
    const Institution = connection.model("Institution");

    const result = await Institution.findOneAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).select(DEFAULT_PROJECTION).exec();

    if (result) {
        return res.json(result);
    }
    else {
        res.status(404);
        res.json({ error: "Resource not found" });
    }
}

/**
 * DELETE /:id
 */
async function deleteIdRoute(req, res) {
    const connection = await database.connect();
    const Institution = connection.model("Institution");

    const result = await Institution.findOneAndDelete(req.params.id).exec();

    if (result) {
        return res.json(result);
    }
    else {
        res.status(404);
        res.json({ error: "Resource not found" });
    }
}

router.get("/:id", getIdRoute);
router.patch("/:id", patchIdRoute);
router.delete("/:id", deleteIdRoute);

router.get("/", getIndexRoute);
router.post("/", postIndexRoute);

module.exports = router;