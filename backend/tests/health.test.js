const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/movie_rating_site?schema=public";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.NODE_ENV = "production";
process.env.CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ||
  "http://localhost:3000,https://magic-housemoviewebsite-xxxx.vercel.app";

const app = require("../src/app");

test("GET /api/health returns service status", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.message, "服务运行正常。");
});

test("GET /api/health returns CORS header for allowed Vercel origin", async () => {
  const origin = "https://magic-housemoviewebsite-xxxx.vercel.app";
  const response = await request(app).get("/api/health").set("Origin", origin);

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["access-control-allow-origin"], origin);
});

test("GET /api/health blocks disallowed origins", async () => {
  const origin = "https://evil.example.com";
  const response = await request(app).get("/api/health").set("Origin", origin);

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.message, `CORS blocked for origin: ${origin}`);
});
