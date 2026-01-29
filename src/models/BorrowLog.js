/**
 * BorrowLog Model
 * Represents a borrow transaction with geolocation data
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BorrowLog = sequelize.define('BorrowLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Primary key - Auto-incremented borrow log ID'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'User ID is required'
            },
            isInt: {
                msg: 'User ID must be an integer'
            },
            min: {
                args: [1],
                msg: 'User ID must be a positive integer'
            }
        },
        comment: 'ID of the user who borrowed the book'
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'books',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'Book ID is required'
            },
            isInt: {
                msg: 'Book ID must be an integer'
            }
        },
        comment: 'Foreign key referencing books table'
    },
    borrowDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: {
                msg: 'Borrow date must be a valid date'
            }
        },
        comment: 'Date when the book was borrowed'
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Latitude is required'
            },
            isFloat: {
                msg: 'Latitude must be a valid number'
            },
            min: {
                args: [-90],
                msg: 'Latitude must be between -90 and 90'
            },
            max: {
                args: [90],
                msg: 'Latitude must be between -90 and 90'
            }
        },
        comment: 'Latitude coordinate of borrow location'
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Longitude is required'
            },
            isFloat: {
                msg: 'Longitude must be a valid number'
            },
            min: {
                args: [-180],
                msg: 'Longitude must be between -180 and 180'
            },
            max: {
                args: [180],
                msg: 'Longitude must be between -180 and 180'
            }
        },
        comment: 'Longitude coordinate of borrow location'
    }
}, {
    tableName: 'borrow_logs',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['bookId']
        },
        {
            fields: ['borrowDate']
        }
    ]
});

module.exports = BorrowLog;
