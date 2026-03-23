const prisma = require("../lib/prisma");
const env = require("../config/env");
const { fetchTmdbCollection } = require("./tmdbService");

function normalizeMovie(movie, flagField) {
  return {
    title: movie.title || movie.name || "未命名电影",
    posterPath: movie.poster_path || null,
    overview: movie.overview || "暂无简介。",
    releaseDate: movie.release_date ? new Date(movie.release_date) : null,
    tmdbRating:
      typeof movie.vote_average === "number" ? Number(movie.vote_average.toFixed(1)) : null,
    popularity: typeof movie.popularity === "number" ? movie.popularity : null,
    [flagField]: true,
    syncedAt: new Date()
  };
}

async function syncCollection(pathname, flagField) {
  await prisma.movie.updateMany({
    data: {
      [flagField]: false
    }
  });

  let count = 0;

  for (let page = 1; page <= env.tmdbSyncPages; page += 1) {
    const movies = await fetchTmdbCollection(pathname, page);

    for (const movie of movies) {
      const normalized = normalizeMovie(movie, flagField);

      await prisma.movie.upsert({
        where: {
          tmdbId: movie.id
        },
        update: normalized,
        create: {
          tmdbId: movie.id,
          title: normalized.title,
          posterPath: normalized.posterPath,
          overview: normalized.overview,
          releaseDate: normalized.releaseDate,
          tmdbRating: normalized.tmdbRating,
          popularity: normalized.popularity,
          isNowPlaying: flagField === "isNowPlaying",
          isPopular: flagField === "isPopular",
          syncedAt: normalized.syncedAt
        }
      });

      count += 1;
    }
  }

  return count;
}

async function syncNowPlayingAndPopular() {
  const nowPlaying = await syncCollection("/movie/now_playing", "isNowPlaying");
  const popular = await syncCollection("/movie/popular", "isPopular");

  return {
    nowPlaying,
    popular,
    total: nowPlaying + popular
  };
}

module.exports = {
  syncNowPlayingAndPopular
};

