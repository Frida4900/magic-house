function createRateLimit({ windowMs, max }) {
  const buckets = new Map();

  return function rateLimit(req, res, next) {
    const forwardedFor = req.headers["x-forwarded-for"];
    const ip =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) ||
      req.ip ||
      "unknown";
    const now = Date.now();
    const bucket = buckets.get(ip);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(ip, {
        count: 1,
        resetAt: now + windowMs
      });
      return next();
    }

    if (bucket.count >= max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({
        message: "请求过于频繁，请稍后再试。"
      });
    }

    bucket.count += 1;
    return next();
  };
}

module.exports = createRateLimit;

