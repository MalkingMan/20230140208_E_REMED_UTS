/**
 * Models Index
 * Centralizes all models and defines associations
 */

const { sequelize } = require('../config/database');
const Book = require('./Book');
const BorrowLog = require('./BorrowLog');

// Define Associations

/**
 * Book has many BorrowLogs
 * One book can be borrowed multiple times
 */
Book.hasMany(BorrowLog, {
    foreignKey: 'bookId',
    as: 'borrowLogs',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 * BorrowLog belongs to one Book
 * Each borrow transaction is associated with one book
 */
BorrowLog.belongsTo(Book, {
    foreignKey: 'bookId',
    as: 'book'
});

module.exports = {
    sequelize,
    Book,
    BorrowLog
};
