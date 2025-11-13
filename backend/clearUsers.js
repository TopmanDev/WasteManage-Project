/**
 * Script to clear all users from the database
 * Use this to start fresh if you have corrupted user data
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const clearUsers = async () => {
  try {
    console.log('\n⚠️  WARNING: This will delete ALL users from the database!');
    console.log('Connecting to MongoDB...\n');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wasteManagement');
    console.log('✅ Connected to MongoDB\n');
    
    // Delete all users
    const result = await mongoose.connection.db.collection('users').deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} user(s) from the database`);
    console.log('\nYou can now register a new account with a clean slate!\n');
    
    await mongoose.connection.close();
    console.log('Database connection closed.\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
clearUsers();
