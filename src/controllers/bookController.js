/**
 * Book Controller
 * Handles all book-related operations
 */

const { Book } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all books
 * PUBLIC endpoint
 * @route GET /api/books
 */
const getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            count: books.length,
            data: books
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single book by ID
 * PUBLIC endpoint
 * @route GET /api/books/:id
 */
const getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID is a number
        if (isNaN(id)) {
            throw new ApiError(400, 'Invalid book ID: must be a number');
        }

        const book = await Book.findByPk(id);

        if (!book) {
            throw new ApiError(404, `Book with ID ${id} not found`);
        }

        res.status(200).json({
            success: true,
            message: 'Book retrieved successfully',
            data: book
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new book
 * ADMIN only endpoint
 * @route POST /api/books
 */
const createBook = async (req, res, next) => {
    try {
        const { title, author, stock } = req.body;

        // Manual validation for clear error messages
        if (!title || title.trim() === '') {
            throw new ApiError(400, 'Title is required and cannot be empty');
        }

        if (!author || author.trim() === '') {
            throw new ApiError(400, 'Author is required and cannot be empty');
        }

        // Validate stock if provided
        if (stock !== undefined) {
            if (typeof stock !== 'number' || !Number.isInteger(stock)) {
                throw new ApiError(400, 'Stock must be an integer');
            }
            if (stock < 0) {
                throw new ApiError(400, 'Stock cannot be negative');
            }
        }

        const book = await Book.create({
            title: title.trim(),
            author: author.trim(),
            stock: stock !== undefined ? stock : 0
        });

        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update a book
 * ADMIN only endpoint
 * @route PUT /api/books/:id
 */
const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, author, stock } = req.body;

        // Validate ID is a number
        if (isNaN(id)) {
            throw new ApiError(400, 'Invalid book ID: must be a number');
        }

        // Find the book
        const book = await Book.findByPk(id);

        if (!book) {
            throw new ApiError(404, `Book with ID ${id} not found`);
        }

        // Validate updates
        const updates = {};

        if (title !== undefined) {
            if (title.trim() === '') {
                throw new ApiError(400, 'Title cannot be empty');
            }
            updates.title = title.trim();
        }

        if (author !== undefined) {
            if (author.trim() === '') {
                throw new ApiError(400, 'Author cannot be empty');
            }
            updates.author = author.trim();
        }

        if (stock !== undefined) {
            if (typeof stock !== 'number' || !Number.isInteger(stock)) {
                throw new ApiError(400, 'Stock must be an integer');
            }
            if (stock < 0) {
                throw new ApiError(400, 'Stock cannot be negative');
            }
            updates.stock = stock;
        }

        // Check if there are any updates
        if (Object.keys(updates).length === 0) {
            throw new ApiError(400, 'No valid fields provided for update');
        }

        // Update the book
        await book.update(updates);

        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: book
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a book
 * ADMIN only endpoint
 * @route DELETE /api/books/:id
 */
const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID is a number
        if (isNaN(id)) {
            throw new ApiError(400, 'Invalid book ID: must be a number');
        }

        const book = await Book.findByPk(id);

        if (!book) {
            throw new ApiError(404, `Book with ID ${id} not found`);
        }

        // Store book data before deletion for response
        const deletedBook = book.toJSON();

        await book.destroy();

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: deletedBook
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};
