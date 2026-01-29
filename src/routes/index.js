/**
 * Routes Index
 * Centralizes all API routes
 */

const express = require('express');
const router = express.Router();
const bookRoutes = require('./bookRoutes');
const borrowRoutes = require('./borrowRoutes');

/**
 * API Health Check
 * @route GET /api
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Library System API is running',
        version: '1.0.0',
        endpoints: {
            books: {
                'GET /api/books': 'Get all books (Public)',
                'GET /api/books/:id': 'Get book by ID (Public)',
                'POST /api/books': 'Create book (Admin)',
                'PUT /api/books/:id': 'Update book (Admin)',
                'DELETE /api/books/:id': 'Delete book (Admin)'
            },
            borrow: {
                'POST /api/borrow': 'Borrow a book (User)',
                'GET /api/borrow/my-logs': 'Get my borrow history (User)',
                'GET /api/borrow/logs': 'Get all borrow logs (Admin)'
            }
        },
        headers: {
            'x-user-role': 'admin | user',
            'x-user-id': 'integer (required for user role)'
        }
    });
});

// Mount routes
router.use('/books', bookRoutes);
router.use('/borrow', borrowRoutes);

module.exports = router;
