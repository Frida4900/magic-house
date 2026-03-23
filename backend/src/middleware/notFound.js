function notFound(req, res) {
  res.status(404).json({
    message: `未找到接口：${req.method} ${req.originalUrl}`
  });
}

module.exports = notFound;

