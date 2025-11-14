/**
 * Script to check admin details in database
 * Run: node scripts/checkAdmin.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Admin model
const Admin = require('../models/Admin');

const checkAdmin = async () => {
  try {
    console.log('\n===========================================');
    console.log('   CHECKING ADMIN IN DATABASE');
    console.log('===========================================\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all admins
    const admins = await Admin.find({});
    
    console.log(`Found ${admins.length} admin(s):\n`);
    
    admins.forEach((admin, index) => {
      console.log(`Admin #${index + 1}:`);
      console.log(`  ID: ${admin._id}`);
      console.log(`  Name: ${admin.name}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Password Hash: ${admin.password.substring(0, 20)}...`);
      console.log(`  Created: ${admin.createdAt || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.\n');
    process.exit(0);
  }
};

// Run the check
checkAdmin();
