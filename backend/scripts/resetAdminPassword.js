/**
 * Script to reset admin password
 * Run: node scripts/resetAdminPassword.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Admin model
const Admin = require('../models/Admin');

const resetPassword = async () => {
  try {
    console.log('\n===========================================');
    console.log('   ADMIN PASSWORD RESET');
    console.log('===========================================\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find admin by email
    const admin = await Admin.findOne({ email: 'kendry.topmost@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin not found with email: kendry.topmost@gmail.com');
      process.exit(1);
    }

    console.log('Found admin:');
    console.log(`  Name: ${admin.name}`);
    console.log(`  Email: ${admin.email}\n`);

    // Set new password (will be hashed by pre-save hook)
    const newPassword = 'Temi2025';
    
    admin.password = newPassword;
    await admin.save();

    console.log('===========================================');
    console.log('✅ PASSWORD RESET SUCCESSFUL!');
    console.log('===========================================\n');
    console.log('New credentials:');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: ${newPassword}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.\n');
    process.exit(0);
  }
};

// Run the reset
resetPassword();
