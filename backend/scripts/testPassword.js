/**
 * Script to test password verification
 * Run: node scripts/testPassword.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Admin model
const Admin = require('../models/Admin');

const testPassword = async () => {
  try {
    console.log('\n===========================================');
    console.log('   PASSWORD VERIFICATION TEST');
    console.log('===========================================\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find admin
    const admin = await Admin.findOne({ email: 'kendry.topmost@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin not found');
      process.exit(1);
    }

    console.log(`Testing password for: ${admin.email}\n`);

    // Test password
    const testPasswords = ['Temi2025', 'temi2025', 'TEMI2025'];
    
    for (const pwd of testPasswords) {
      const isMatch = await bcrypt.compare(pwd, admin.password);
      console.log(`Password "${pwd}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    }

    console.log('\n---');
    console.log('Stored hash:', admin.password);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.\n');
    process.exit(0);
  }
};

// Run the test
testPassword();
