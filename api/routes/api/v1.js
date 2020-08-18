const express = require("express");
const institutionRouter = require("./v1/institutions");

const router = express.Router();

router.use("/institutions", institutionRouter);

module.exports = router;