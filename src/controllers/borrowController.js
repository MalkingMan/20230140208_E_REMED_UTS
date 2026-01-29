/**
 * Borrow Controller
 * Handles book borrowing operations with geolocation
 */

const { Book, BorrowLog, sequelize } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Borrow a book
 * USER only endpoint - requires x-user-id header
 * Uses Sequelize transaction for data integrity
 * @route POST /api/borrow
 */
const borrowBook = async (req, res, next) => {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        const userId = req.userId; // Set by requireUser middleware
        const { bookId, latitude, longitude } = req.body;

        // Validate request body
        if (!bookId) {
            throw new ApiError(400, 'Book ID is required');
        }

        if (typeof bookId !== 'number' || !Number.isInteger(bookId)) {
            throw new ApiError(400, 'Book ID must be an integer');
        }

        if (latitude === undefined || latitude === null) {
            throw new ApiError(400, 'Latitude is required');
        }

        if (typeof latitude !== 'number') {
            throw new ApiError(400, 'Latitude must be a number');
        }

        if (latitude < -90 || latitude > 90) {
            throw new ApiError(400, 'Latitude must be between -90 and 90');
        }

        if (longitude === undefined || longitude === null) {
            throw new ApiError(400, 'Longitude is required');
        }

        if (typeof longitude !== 'number') {
            throw new ApiError(400, 'Longitude must be a number');
        }

        if (longitude < -180 || longitude > 180) {
            throw new ApiError(400, 'Longitude must be between -180 and 180');
        }

        // Find the book with lock for update (prevents race conditions)
        const book = await Book.findByPk(bookId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        // Check if book exists
        if (!book) {
            throw new ApiError(404, `Book with ID ${bookId} not found`);
        }

        // Check if book is available (stock > 0)
        if (book.stock <= 0) {
            throw new ApiError(400, `Book "${book.title}" is currently out of stock`);
        }

        // Reduce stock by 1
        await book.update(
            { stock: book.stock - 1 },
            { transaction }
        );

        // Create borrow log entry
        const borrowLog = await BorrowLog.create(
            {
                userId,
                bookId,
                borrowDate: new Date(),
                latitude,
                longitude
            },
            { transaction }
        );

        // Commit the transaction
        await transaction.commit();

        // Reload book to get updated data
        await book.reload();

        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: {
                borrowLog: {
                    id: borrowLog.id,
                    userId: borrowLog.userId,
                    bookId: borrowLog.bookId,
                    borrowDate: borrowLog.borrowDate,
                    location: {
                        latitude: borrowLog.latitude,
                        longitude: borrowLog.longitude
                    },
                    createdAt: borrowLog.createdAt
                },
                book: {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    remainingStock: book.stock
                }
            }
        });
    } catch (error) {
        // Rollback the transaction on error
        await transaction.rollback();
        next(error);
    }
};

/**
 * Get all borrow logs (for admin viewing/debugging)
 * This is an optional endpoint for testing purposes
 * @route GET /api/borrow/logs
 */
const getBorrowLogs = async (req, res, next) => {
    try {
        const borrowLogs = await BorrowLog.findAll({
            include: [
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: 'Borrow logs retrieved successfully',
            count: borrowLogs.length,
            data: borrowLogs
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get borrow logs for a specific user
 * USER can view their own borrow history
 * @route GET /api/borrow/my-logs
 */
const getMyBorrowLogs = async (req, res, next) => {
    try {
        const userId = req.userId;

        const borrowLogs = await BorrowLog.findAll({
            where: { userId },
            include: [
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: 'Your borrow logs retrieved successfully',
            count: borrowLogs.length,
            data: borrowLogs
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    borrowBook,
    getBorrowLogs,
    getMyBorrowLogs
};
