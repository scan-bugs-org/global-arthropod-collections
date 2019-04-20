const express = require("express");

const collectionsRouter = require("./collections");
const institutionsRouter = require("./institutions");

let router = express.Router();

// Collections
router.get("/collections", collectionsRouter.index);
router.get("/collections/id/:collectionId", collectionsRouter.byId);
router.get("/collections/search", collectionsRouter.search);

// Institutions
router.get("/institutions", institutionsRouter.index);
router.get("/institutions/id/:institutionId", institutionsRouter.byId);
router.get("/institutions/search", institutionsRouter.search);

module.exports = router;
