const errorHandler = (err, req, res, next) => {
  const statusCode = req.statusCode === 200 ? 500 : statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: err.stack,
  });
};
module.exports = errorHandler;
