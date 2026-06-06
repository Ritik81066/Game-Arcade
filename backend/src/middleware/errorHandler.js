export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.message === 'Validation Error') {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      details: err.details
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
