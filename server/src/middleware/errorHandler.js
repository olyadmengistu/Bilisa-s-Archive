export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    error: err.message || 'Internal server error',
    status: err.status || 500
  };

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.error = 'Invalid token';
    error.status = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.error = 'Token expired';
    error.status = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.error = err.message;
    error.status = 400;
  }

  // Database errors
  if (err.code === '23505') {
    error.error = 'Duplicate entry';
    error.status = 409;
  }

  if (err.code === '23503') {
    error.error = 'Foreign key constraint failed';
    error.status = 400;
  }

  res.status(error.status).json(error);
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
