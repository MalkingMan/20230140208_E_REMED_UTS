/**
 * Server Entry Point
 * Initializes database connection and starts the Express server
 */

require('dotenv').config();
const app = require('./app');
const { testConnection, syncDatabase } = require('./config/database');

// Server configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Initialize and start the server
 */
const startServer = async () => {
    try {
        console.log('🚀 Starting Library System API...');
        console.log(`📌 Environment: ${NODE_ENV}`);

        // Test database connection
        const isConnected = await testConnection();

        if (!isConnected) {
            console.error('❌ Failed to connect to database. Server not started.');
            console.log('\n📋 Please check:');
            console.log('   1. MySQL service is running');
            console.log('   2. Database credentials in .env are correct');
            console.log('   3. Database exists (create it if not)');
            process.exit(1);
        }

        // Sync database models (creates tables if they don't exist)
        // Set to true to drop and recreate tables (useful in development)
        await syncDatabase(false);

        // Start the server
        app.listen(PORT, () => {
            console.log('');
            console.log('╔════════════════════════════════════════════════════════════╗');
            console.log('║         LIBRARY SYSTEM API WITH GEOLOCATION                ║');
            console.log('╠════════════════════════════════════════════════════════════╣');
            console.log(`║  🌐 Server running on: http://localhost:${PORT}              ║`);
            console.log(`║  📚 API Documentation: http://localhost:${PORT}/api          ║`);
            console.log(`║  🔧 Environment: ${NODE_ENV.padEnd(40)}║`);
            console.log('╠════════════════════════════════════════════════════════════╣');
            console.log('║  Available Endpoints:                                      ║');
            console.log('║  ├─ GET    /api/books          (Public)                    ║');
            console.log('║  ├─ GET    /api/books/:id      (Public)                    ║');
            console.log('║  ├─ POST   /api/books          (Admin)                     ║');
            console.log('║  ├─ PUT    /api/books/:id      (Admin)                     ║');
            console.log('║  ├─ DELETE /api/books/:id      (Admin)                     ║');
            console.log('║  └─ POST   /api/borrow         (User)                      ║');
            console.log('╚════════════════════════════════════════════════════════════╝');
            console.log('');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Start the server
startServer();
