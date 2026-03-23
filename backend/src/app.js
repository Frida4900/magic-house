const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const routes = require("./routes");
const createRateLimit = require("./middleware/rateLimit");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", 1);

const allowlist = env.clientOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowlist.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("当前来源不在允许的跨域列表中。"));
    }
  })
);

app.use(
  "/api",
  createRateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    message: "服务运行正常。",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

