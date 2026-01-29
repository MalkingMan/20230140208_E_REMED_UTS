/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Not Found (404) handler
 * Catches requests to undefined routes
 */
const notFoundHandler = (req, res, next) => {
    const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
    next(error);
};

/**
 * Global error handler middleware
 * Formats and sends error responses
 */
const errorHandler = (err, req, res, next) => {
    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let details = err.details || null;

    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        details = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
    }

    // Handle Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Duplicate Entry';
        details = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
    }

    // Handle Sequelize foreign key errors
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 400;
        message = 'Invalid Reference';
        details = 'Referenced record does not exist';
    }

    // Handle Sequelize database errors
    if (err.name === 'SequelizeDatabaseError') {
        statusCode = 500;
        message = 'Database Error';
        // Don't expose raw database errors in production
        if (process.env.NODE_ENV !== 'development') {
            details = null;
        }
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            statusCode,
            message,
            details,
            stack: err.stack
        });
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: getErrorName(statusCode),
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Get HTTP error name from status code
 * @param {number} statusCode 
 * @returns {string} Error name
 */
const getErrorName = (statusCode) => {
    const errorNames = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        500: 'Internal Server Error'
    };
    return errorNames[statusCode] || 'Error';
};

module.exports = {
    ApiError,
    notFoundHandler,
    errorHandler
};
