/**
 * Script to reset/recreate admin account
 * Use this if you're getting "Invalid password" error
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const readline = require('readline');

// Load environment variables
dotenv.config();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const resetAdmin = async () => {
  try {
    console.log('\n===========================================');
    console.log('   ADMIN ACCOUNT RESET');
    console.log('===========================================\n');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wasteManagement');
    console.log('✅ Connected to MongoDB\n');

    // Get admin details
    const email = await question('Admin Email: ');
    const newPassword = await question('New Password (min 6 characters): ');
    const confirmPassword = await question('Confirm Password: ');

    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update or create admin
    const Admin = mongoose.connection.db.collection('admins');
    
    const result = await Admin.updateOne(
      { email: email.toLowerCase().trim() },
      { 
        $set: { 
          password: hashedPassword,
          email: email.toLowerCase().trim()
        }
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('\n✅ Admin account created successfully!');
    } else if (result.modifiedCount > 0) {
      console.log('\n✅ Admin password reset successfully!');
    } else {
      console.log('\n✅ Admin account updated!');
    }

    console.log(`\nYou can now login with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    console.log('\n⚠️  Remember to delete this script after use!\n');

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

// Run the script
resetAdmin();
