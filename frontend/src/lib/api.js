const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
  throw new Error("缺少 VITE_API_URL，请在前端环境变量中配置后端地址。");
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
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
