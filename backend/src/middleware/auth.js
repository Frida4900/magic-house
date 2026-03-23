const { verifyToken } = require("../utils/jwt");

function extractBearerToken(header = "") {
  if (!header.startsWith("Bearer ")) {
    return null;
  }

  return header.slice(7).trim();
}

function requireAuth(req, res, next) {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "请先登录后再操作。" });
    }

    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "登录状态已失效，请重新登录。" });
  }
}

function optionalAuth(req, _res, next) {
  try {
    const token = extractBearerToken(req.headers.authorization);
    req.user = token ? verifyToken(token) : null;
  } catch (error) {
    req.user = null;
  }

  next();
}

module.exports = {
  requireAuth,
  optionalAuth
};

