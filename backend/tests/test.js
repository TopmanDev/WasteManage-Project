/**
 * Comprehensive API Tests for Waste Management System
 * Uses: supertest, mongoose, mongodb-memory-server
 * Run with: npm test
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import models
const User = require('../models/User');
const Admin = require('../models/Admin');
const PickupRequest = require('../models/PickupRequest');

// Import routes
const userAuthRoutes = require('../routes/userAuthRoutes');
const adminAuthRoutes = require('../routes/adminAuthRoutes');
const pickupRequestRoutes = require('../routes/pickupRequestRoutes');

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth/user', userAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/pickup-requests', pickupRequestRoutes);

// Test database
let mongoServer;
let testUser;
let testAdmin;
let userToken;
let adminToken;

// Test counters
let passed = 0;
let failed = 0;

// Custom test runner
async function test(description, testFn) {
  try {
    await testFn();
    console.log(`✅ PASS: ${description}`);
    passed++;
  } catch (error) {
    console.log(`❌ FAIL: ${description}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

// Setup test database before all tests
async function setupDatabase() {
  console.log('🔧 Setting up test database...');
  
  // Set test environment variable
  process.env.JWT_SECRET = 'test-secret-key-for-testing';
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log('✅ Test database connected\n');
}

// Cleanup after all tests
async function teardownDatabase() {
  console.log('\n🧹 Cleaning up...');
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('✅ Database cleaned up');
}

// Create test user and admin
async function seedTestData() {
  console.log('🌱 Seeding test data...');
  
  // Create test user (User model auto-hashes password)
  testUser = await User.create({
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    phoneNumber: '+2348030000000',
    password: 'testpassword123', // Plain password - will be hashed by pre-save hook
    address: {
      street: '123 Test Street',
      city: 'Ikeja',
      state: 'Lagos State',
      zipCode: '100001'
    }
  });
  
  // Create test admin (Admin model also auto-hashes password)
  testAdmin = await Admin.create({
    name: 'Test Admin',
    email: 'admin@wastemanage.com',
    password: 'testpassword123', // Plain password - will be hashed by pre-save hook
    role: 'super-admin'
  });
  
  // Generate tokens
  userToken = jwt.sign(
    { id: testUser._id, email: testUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  adminToken = jwt.sign(
    { id: testAdmin._id, email: testAdmin.email, role: testAdmin.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  console.log('✅ Test data seeded\n');
}

// Run all tests
async function runTests() {
  console.log('🧪 Running Waste Management API Tests...\n');
  
  try {
    await setupDatabase();
    await seedTestData();
    
    // ========================================
    // Unit Tests - Models
    // ========================================
    console.log('📦 Testing Models...');
    
    await test('User model should create a valid user', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+2348012345678',
        password: 'hashedpassword',
        address: {
          street: '456 Test Road',
          city: 'Lagos',
          state: 'Lagos State',
          zipCode: '100002'
        }
      });
      await user.save();
      if (!user._id) throw new Error('User not saved');
    });
    
    await test('PickupRequest model should create a valid request', async () => {
      const pickup = new PickupRequest({
        user: testUser._id,
        address: 'Test Address, Lagos',
        wasteType: 'plastics',
        estimatedWeight: 10,
        preferredDate: new Date(),
        preferredTimeSlot: 'morning'
      });
      await pickup.save();
      if (!pickup._id) throw new Error('PickupRequest not saved');
    });
    
    // ========================================
    // Integration Tests - User Auth API
    // ========================================
    console.log('\n🌐 Testing User Authentication API...');
    
    await test('POST /api/auth/user/register - should register new user', async () => {
      const response = await request(app)
        .post('/api/auth/user/register')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phoneNumber: '+2348098765432',
          password: 'password123',
          address: {
            street: '789 Main St',
            city: 'Ikeja',
            state: 'Lagos',
            zipCode: '100003'
          }
        });
      
      if (response.status !== 201) {
        throw new Error(`Expected 201, got ${response.status}`);
      }
      if (!response.body.success) {
        throw new Error('Registration should be successful');
      }
    });
    
    await test('POST /api/auth/user/register - should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/user/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'testuser@example.com', // Already exists
          phoneNumber: '+2348012345678',
          password: 'password123',
          address: {
            street: '123 Test St',
            city: 'Lagos',
            state: 'Lagos',
            zipCode: '100001'
          }
        });
      
      if (response.status === 201) {
        throw new Error('Should not allow duplicate email');
      }
    });
    
    await test('POST /api/auth/user/login - should login existing user', async () => {
      const response = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: 'testuser@example.com',
          password: 'testpassword123'
        });
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      if (!response.body.token) {
        throw new Error('No token returned');
      }
    });
    
    await test('POST /api/auth/user/login - should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        });
      
      if (response.status === 200) {
        throw new Error('Should not login with wrong password');
      }
    });
    
    // ========================================
    // Integration Tests - Admin Auth API
    // ========================================
    console.log('\n🌐 Testing Admin Authentication API...');
    
    await test('POST /api/auth/admin/login - should login admin', async () => {
      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({
          email: 'admin@wastemanage.com',
          password: 'testpassword123'
        });
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      if (!response.body.token) {
        throw new Error('No token returned');
      }
    });
    
    // ========================================
    // Integration Tests - Pickup Requests API
    // ========================================
    console.log('\n🌐 Testing Pickup Request API...');
    
    await test('POST /api/pickup-requests - should create pickup request with auth', async () => {
      const response = await request(app)
        .post('/api/pickup-requests')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          address: 'Test Address, Lagos',
          wasteType: 'paper',
          estimatedWeight: 15,
          preferredDate: new Date().toISOString(),
          preferredTimeSlot: 'afternoon',
          description: 'Test pickup'
        });
      
      if (response.status !== 201) {
        throw new Error(`Expected 201, got ${response.status}: ${JSON.stringify(response.body)}`);
      }
    });
    
    await test('POST /api/pickup-requests - should reject without auth', async () => {
      const response = await request(app)
        .post('/api/pickup-requests')
        .send({
          address: 'Test Address',
          wasteType: 'paper',
          estimatedWeight: 10,
          preferredDate: new Date().toISOString(),
          preferredTimeSlot: 'morning'
        });
      
      if (response.status === 201) {
        throw new Error('Should require authentication');
      }
    });
    
    await test('GET /api/pickup-requests/my-requests - should get user requests', async () => {
      const response = await request(app)
        .get('/api/pickup-requests/my-requests')
        .set('Authorization', `Bearer ${userToken}`);
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      if (!Array.isArray(response.body.data)) {
        throw new Error('Should return array of requests');
      }
    });
    
    await test('GET /api/pickup-requests - admin should get all requests', async () => {
      const response = await request(app)
        .get('/api/pickup-requests')
        .set('Authorization', `Bearer ${adminToken}`);
      
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
    });
    
    // ========================================
    // Unit Tests - Password Hashing
    // ========================================
    console.log('\n� Testing Security Functions...');
    
    await test('bcrypt should hash passwords correctly', async () => {
      const password = 'testpassword';
      const hashed = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hashed);
      if (!isMatch) throw new Error('Password hash/compare failed');
    });
    
    await test('JWT should sign and verify tokens', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });
      const decoded = jwt.verify(token, 'secret');
      if (decoded.email !== payload.email) throw new Error('JWT verification failed');
    });
    
    // ========================================
    // Cleanup
    // ========================================
    await teardownDatabase();
    
    // ========================================
    // Results Summary
    // ========================================
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Results:');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total:  ${passed + failed}`);
    console.log('='.repeat(50));
    
    if (failed > 0) {
      console.log('\n⚠️  Some tests failed. Please check the errors above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n❌ Fatal error running tests:', error);
    await teardownDatabase();
    process.exit(1);
  }
}

// Run tests
runTests();
