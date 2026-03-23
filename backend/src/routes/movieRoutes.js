const express = require("express");
const {
  getNowPlayingMovies,
  getPopularMovies,
  getRecommendedMovies,
  getMovieDetail,
  upsertRating,
  addComment
} = require("../controllers/movieController");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/now-playing", getNowPlayingMovies);
router.get("/popular", getPopularMovies);
router.get("/recommended", getRecommendedMovies);
router.get("/:id", optionalAuth, getMovieDetail);
router.post("/:id/ratings", requireAuth, upsertRating);
router.post("/:id/comments", requireAuth, addComment);

module.exports = router;

