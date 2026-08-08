const { sendError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    statusCode = 400;
  }

  console.error('Server Error Stack:', err.stack);

  return sendError(
    res,
    statusCode,
    message,
    err.code ? `ERR_${err.code}` : 'SERVER_ERROR',
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};

module.exports = errorHandler;
