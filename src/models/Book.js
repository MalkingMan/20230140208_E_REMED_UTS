/**
 * Book Model
 * Represents a book in the library system
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Primary key - Auto-incremented book ID'
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Title is required'
            },
            notEmpty: {
                msg: 'Title cannot be empty'
            },
            len: {
                args: [1, 255],
                msg: 'Title must be between 1 and 255 characters'
            }
        },
        comment: 'Book title - Required field'
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Author is required'
            },
            notEmpty: {
                msg: 'Author cannot be empty'
            },
            len: {
                args: [1, 255],
                msg: 'Author name must be between 1 and 255 characters'
            }
        },
        comment: 'Book author - Required field'
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: {
                msg: 'Stock must be an integer'
            },
            min: {
                args: [0],
                msg: 'Stock cannot be negative'
            }
        },
        comment: 'Available stock quantity - Must be >= 0'
    }
}, {
    tableName: 'books',
    timestamps: true,
    indexes: [
        {
            fields: ['title']
        },
        {
            fields: ['author']
        }
    ]
});

module.exports = Book;
