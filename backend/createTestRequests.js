/**
 * Script to create test pickup requests with scheduled status
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const createTestRequests = async () => {
  try {
    console.log('Connecting to MongoDB...\n');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wasteManagement');
    console.log('✅ Connected to MongoDB\n');
    
    // Sample scheduled pickup requests
    const testRequests = [
      {
        userName: 'John Doe',
        userEmail: 'john@example.com',
        userPhone: '+1234567890',
        address: '123 Main St, Springfield',
        wasteType: ['plastics', 'cartons'],
        estimatedWeight: 15,
        preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        preferredTimeSlot: 'morning',
        status: 'scheduled',
        description: 'Test pickup request 1'
      },
      {
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        userPhone: '+1234567891',
        address: '456 Oak Ave, Springfield',
        wasteType: ['tins', 'mixed'],
        estimatedWeight: 20,
        preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        preferredTimeSlot: 'afternoon',
        status: 'scheduled',
        description: 'Test pickup request 2'
      },
      {
        userName: 'Bob Johnson',
        userEmail: 'bob@example.com',
        userPhone: '+1234567892',
        address: '789 Elm St, Springfield',
        wasteType: ['cartons'],
        estimatedWeight: 10,
        preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        preferredTimeSlot: 'morning',
        status: 'scheduled',
        description: 'Test pickup request 3'
      }
    ];

    // Insert test requests
    const result = await mongoose.connection.db.collection('pickuprequests').insertMany(testRequests);
    
    console.log(`✅ Created ${result.insertedCount} test scheduled pickup requests`);
    console.log('\nYou can now view these on the Routing page!\n');
    
    await mongoose.connection.close();
    console.log('Database connection closed.\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
createTestRequests();
