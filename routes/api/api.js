const express = require("express");

const collectionsRouter = require("./collections");
const institutionsRouter = require("./institutions");

let router = express.Router();

// Collections
router.get("/collections", collectionsRouter.index);
router.get("/collections/:institutionCode/:collectionCode", collectionsRouter.byId);

// Institutions
router.get("/institutions", institutionsRouter.index);
router.get("/institutions/:institutionCode", institutionsRouter.byId);

module.exports = router;
