// Custom error response middleware
// Usage: call next(error) from any controller/route
// It catches the error here and sends a clean JSON response

const errorHandler = (err, req, res, next) => {
  // Use the status code set on the error, or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Show stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
