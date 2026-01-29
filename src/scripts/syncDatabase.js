/**
 * Database Synchronization Script
 * Run this script to create/recreate database tables
 * 
 * Usage:
 *   npm run db:sync
 *   node src/scripts/syncDatabase.js
 *   node src/scripts/syncDatabase.js --force (to drop and recreate)
 */

require('dotenv').config();
const { sequelize, testConnection, syncDatabase } = require('../config/database');
const { Book, BorrowLog } = require('../models');

const runSync = async () => {
    try {
        console.log('📦 Database Synchronization Script');
        console.log('===================================\n');

        // Check for --force flag
        const force = process.argv.includes('--force');

        if (force) {
            console.log('⚠️  WARNING: Force sync enabled - tables will be dropped and recreated!\n');
        }

        // Test connection
        const isConnected = await testConnection();

        if (!isConnected) {
            console.error('\n❌ Cannot proceed without database connection.');
            process.exit(1);
        }

        // Sync database
        console.log(`\n🔄 Syncing database${force ? ' (FORCE MODE)' : ''}...`);
        await syncDatabase(force);

        // Show table info
        console.log('\n📋 Tables created/verified:');
        console.log('   - books');
        console.log('   - borrow_logs\n');

        // Show model attributes
        console.log('📊 Book Model Attributes:');
        Object.entries(Book.rawAttributes).forEach(([key, value]) => {
            console.log(`   - ${key}: ${value.type.constructor.name}${value.allowNull === false ? ' (required)' : ''}`);
        });

        console.log('\n📊 BorrowLog Model Attributes:');
        Object.entries(BorrowLog.rawAttributes).forEach(([key, value]) => {
            console.log(`   - ${key}: ${value.type.constructor.name}${value.allowNull === false ? ' (required)' : ''}`);
        });

        console.log('\n✅ Database synchronization completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Synchronization failed:', error.message);
        process.exit(1);
    }
};

runSync();
