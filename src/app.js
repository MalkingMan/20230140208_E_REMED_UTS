/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling
 */

const express = require('express');
const routes = require('./routes');
const { extractUserInfo } = require('./middleware/roleMiddleware');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Create Express app
const app = express();

/**
 * Middleware Configuration
 */

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Extract user info from headers (makes it available in req.userRole and req.userId)
app.use(extractUserInfo);

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        if (req.userRole) {
            console.log(`  Role: ${req.userRole}, User ID: ${req.userId || 'N/A'}`);
        }
        next();
    });
}

/**
 * API Routes
 */

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Library System API with Geolocation',
        documentation: '/api',
        version: '1.0.0'
    });
});

// Mount API routes
app.use('/api', routes);

/**
 * Error Handling
 */

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
