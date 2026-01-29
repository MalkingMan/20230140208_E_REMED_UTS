/**
 * Book Routes
 * Defines routes for book-related operations
 */

const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireAdmin } = require('../middleware/roleMiddleware');

/**
 * PUBLIC ROUTES
 * No authentication required
 */

/**
 * @route   GET /api/books
 * @desc    Get all books
 * @access  Public
 */
router.get('/', bookController.getAllBooks);

/**
 * @route   GET /api/books/:id
 * @desc    Get a single book by ID
 * @access  Public
 */
router.get('/:id', bookController.getBookById);

/**
 * ADMIN ROUTES
 * Requires x-user-role: admin header
 */

/**
 * @route   POST /api/books
 * @desc    Create a new book
 * @access  Admin only
 */
router.post('/', requireAdmin, bookController.createBook);

/**
 * @route   PUT /api/books/:id
 * @desc    Update a book
 * @access  Admin only
 */
router.put('/:id', requireAdmin, bookController.updateBook);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book
 * @access  Admin only
 */
router.delete('/:id', requireAdmin, bookController.deleteBook);

module.exports = router;
