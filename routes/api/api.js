const express = require("express");

const collectionsRouter = require("./collections");
const institutionsRouter = require("./institutions");

let router = express.Router();

// Collections
router.get("/collections", collectionsRouter.index);
router.get("/collections/:collectionId", collectionsRouter.byId);

// Institutions
router.get("/institutions", institutionsRouter.index);
router.get("/institutions/:institutionId", institutionsRouter.byId);

module.exports = router;
