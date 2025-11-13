/**
 * One-time script to create the single admin account
 * Run this script ONLY ONCE to set up your admin account
 * 
 * Usage: node scripts/createAdmin.js
 * 
 * IMPORTANT: Delete this script after creating the admin account for security
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const readline = require('readline');

// Load environment variables
dotenv.config();

// Import Admin model
const Admin = require('../models/Admin');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions
const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

// Main setup function
const setupAdmin = async () => {
  try {
    console.log('\n===========================================');
    console.log('   SINGLE ADMIN ACCOUNT SETUP');
    console.log('===========================================\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wasteManagement');
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('⚠️  WARNING: An admin account already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}\n`);
      
      const overwrite = await question('Do you want to delete the existing admin and create a new one? (yes/no): ');
      
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('\n❌ Setup cancelled. Existing admin account retained.');
        process.exit(0);
      }
      
      await Admin.deleteOne({ _id: existingAdmin._id });
      console.log('✅ Existing admin account deleted.\n');
    }

    // Get admin details from user
    console.log('Please enter the admin account details:\n');
    
    const name = await question('Admin Name: ');
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }

    const email = await question('Admin Email: ');
    if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
      throw new Error('Valid email is required');
    }

    const password = await question('Admin Password (min 6 characters): ');
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const confirmPassword = await question('Confirm Password: ');
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await admin.save();

    console.log('\n===========================================');
    console.log('✅ ADMIN ACCOUNT CREATED SUCCESSFULLY!');
    console.log('===========================================\n');
    console.log('Admin Details:');
    console.log(`  Name: ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role: ${admin.role}`);
    console.log('\n⚠️  SECURITY REMINDER:');
    console.log('  1. Keep your admin credentials secure');
    console.log('  2. Delete this script file for security');
    console.log('  3. Change your password after first login\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.connection.close();
    console.log('Database connection closed.\n');
    process.exit(0);
  }
};

// Run the setup
setupAdmin();
