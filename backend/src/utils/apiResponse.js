const sendSuccess = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message, errorCode = 'BAD_REQUEST', details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    details,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
