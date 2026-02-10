/**
 * Centralized error handling middleware.
 * Catches all unhandled errors and returns a consistent JSON response.
 */
const errorHandler = (err, req, res, _next) => {
    console.error('Unhandled error:', err.message);

    const statusCode = err.statusCode || 500;
    const message =
        process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message || 'Internal server error';

    res.status(statusCode).json({
        is_success: false,
        error: message
    });
};

module.exports = errorHandler;
