/**
 * Database Seeding Script
 * Populates the database with sample data for testing
 * 
 * Usage:
 *   node src/scripts/seedData.js
 */

require('dotenv').config();
const { testConnection } = require('../config/database');
const { Book, BorrowLog } = require('../models');

// Sample book data
const sampleBooks = [
    {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        stock: 5
    },
    {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        stock: 3
    },
    {
        title: '1984',
        author: 'George Orwell',
        stock: 7
    },
    {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        stock: 4
    },
    {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        stock: 2
    },
    {
        title: 'One Hundred Years of Solitude',
        author: 'Gabriel García Márquez',
        stock: 6
    },
    {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        stock: 8
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        stock: 10
    },
    {
        title: 'The Hitchhiker\'s Guide to the Galaxy',
        author: 'Douglas Adams',
        stock: 4
    },
    {
        title: 'Brave New World',
        author: 'Aldous Huxley',
        stock: 3
    }
];

const runSeed = async () => {
    try {
        console.log('🌱 Database Seeding Script');
        console.log('==========================\n');

        // Test connection
        const isConnected = await testConnection();

        if (!isConnected) {
            console.error('\n❌ Cannot proceed without database connection.');
            process.exit(1);
        }

        // Check if books already exist
        const existingCount = await Book.count();

        if (existingCount > 0) {
            console.log(`⚠️  Database already has ${existingCount} books.`);
            console.log('   Skipping seed to avoid duplicates.');
            console.log('   To reset and reseed, run: node src/scripts/syncDatabase.js --force');
            process.exit(0);
        }

        // Insert sample books
        console.log('📚 Inserting sample books...\n');

        const createdBooks = await Book.bulkCreate(sampleBooks);

        createdBooks.forEach(book => {
            console.log(`   ✓ Created: "${book.title}" by ${book.author} (Stock: ${book.stock})`);
        });

        console.log(`\n✅ Successfully seeded ${createdBooks.length} books!`);
        console.log('\n💡 You can now test the API with these books.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

runSeed();
