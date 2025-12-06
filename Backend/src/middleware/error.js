const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    console.error(err);
  
    if (err.name === 'CastError') {
      const message = 'Resource not found';
      error = { statusCode: 404, message };
    }
  
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const message = `${field} already exists`;
      error = { statusCode: 400, message };
    }
  
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = { statusCode: 400, message };
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  module.exports = errorHandler;