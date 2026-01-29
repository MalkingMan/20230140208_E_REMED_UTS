/**
 * Borrow Routes
 * Defines routes for borrowing operations
 */

const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { requireUser, requireAdmin } = require('../middleware/roleMiddleware');

/**
 * USER ROUTES
 * Requires x-user-role: user and x-user-id headers
 */

/**
 * @route   POST /api/borrow
 * @desc    Borrow a book
 * @access  User only (requires x-user-role: user and x-user-id)
 * @body    { bookId: number, latitude: number, longitude: number }
 */
router.post('/', requireUser, borrowController.borrowBook);

/**
 * @route   GET /api/borrow/my-logs
 * @desc    Get current user's borrow history
 * @access  User only
 */
router.get('/my-logs', requireUser, borrowController.getMyBorrowLogs);

/**
 * ADMIN ROUTES
 * For testing and administrative purposes
 */

/**
 * @route   GET /api/borrow/logs
 * @desc    Get all borrow logs (admin only)
 * @access  Admin only
 */
router.get('/logs', requireAdmin, borrowController.getBorrowLogs);

module.exports = router;
