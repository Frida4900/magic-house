const express = require("express");
const authRoutes = require("./authRoutes");
const movieRoutes = require("./movieRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/movies", movieRoutes);

module.exports = router;

