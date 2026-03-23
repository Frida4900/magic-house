const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const routes = require("./routes");
const createRateLimit = require("./middleware/rateLimit");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const isDevelopment = process.env.NODE_ENV !== 'production';

const allowedOrigins = [
  "http://localhost:3000",
  "https://magic-house.pages.dev"
];

function isAllowedOrigin(origin) {
  return (
    allowedOrigins.includes(origin) ||
    /^https:\/\/.*\.vercel\.app$/.test(origin)
  );
}

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || isDevelopment || isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

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
