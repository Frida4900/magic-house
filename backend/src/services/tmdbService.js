const env = require("../config/env");

async function fetchTmdbCollection(pathname, page = 1) {
  if (!env.tmdbApiKey) {
    throw new Error("缺少 TMDB_API_KEY，无法同步电影数据。");
  }

  const url = new URL(`${env.tmdbBaseUrl}${pathname}`);
  url.searchParams.set("api_key", env.tmdbApiKey);
  url.searchParams.set("language", env.tmdbLanguage);
  url.searchParams.set("page", String(page));

  if (pathname.includes("now_playing") && env.tmdbRegion) {
    url.searchParams.set("region", env.tmdbRegion);
  }

  const response = await fetch(url, {
    headers: {
      accept: "application/json"
    }
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`TMDB 请求失败（${response.status}）：${payload}`);
  }

  const payload = await response.json();
  return payload.results || [];
}

function createPosterUrl(posterPath) {
  if (!posterPath) {
    return null;
  }

  return `${env.imageBaseUrl}${posterPath}`;
}

module.exports = {
  fetchTmdbCollection,
  createPosterUrl
};

