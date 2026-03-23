const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 4000),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/movie_rating_site?schema=public",
  jwtSecret: process.env.JWT_SECRET || "please-change-this-secret",
  tmdbApiKey: process.env.TMDB_API_KEY || "",
  tmdbBaseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  tmdbLanguage: process.env.TMDB_LANGUAGE || "zh-CN",
  tmdbRegion: process.env.TMDB_REGION || "CN",
  tmdbSyncPages: Number(process.env.TMDB_SYNC_PAGES || 2),
  syncCron: process.env.SYNC_CRON || "0 4 * * *",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120),
  imageBaseUrl: "https://image.tmdb.org/t/p/w500"
};

