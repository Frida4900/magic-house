function normalizeApiBaseUrl(value) {
  const fallbackUrl = "http://localhost:4000/api";
  const baseUrl = (value || fallbackUrl).replace(/\/+$/, "");

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
}

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = normalizeApiBaseUrl(rawApiUrl);

if (import.meta.env.DEV) {
  console.log("[api] VITE_API_URL =", rawApiUrl);
}

if (!rawApiUrl) {
  console.warn(
    "[api] VITE_API_URL is undefined. Falling back to http://localhost:4000/api"
  );
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || "请求失败，请稍后重试。");
  }

  return data;
}

export async function fetchHomeData() {
  const [nowPlaying, popular, recommended] = await Promise.all([
    request("/movies/now-playing?limit=12"),
    request("/movies/popular?limit=12"),
    request("/movies/recommended?limit=8")
  ]);

  return {
    nowPlaying: nowPlaying.movies || [],
    popular: popular.movies || [],
    recommended: recommended.movies || []
  };
}

export async function fetchMovieDetail(movieId, token) {
  const response = await request(`/movies/${movieId}`, { token });
  return response.movie;
}

export async function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    body: payload
  });
}

export async function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: payload
  });
}

export async function submitRating(movieId, score, token) {
  return request(`/movies/${movieId}/ratings`, {
    method: "POST",
    token,
    body: { score }
  });
}

export async function submitComment(movieId, content, token) {
  return request(`/movies/${movieId}/comments`, {
    method: "POST",
    token,
    body: { content }
  });
}

export { API_BASE_URL };

