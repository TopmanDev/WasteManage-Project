// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const pickupRequestRoutes = require('./routes/pickupRequestRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');

// Initialize Express app
const app = express();

// Middleware
// CORS configuration - allow requests from Vercel frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Use environment variable or allow all
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Database connection
const connectDB = async () => {
  try {
    // Check if MongoDB is running locally
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/wasteManagement');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wasteManagement', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      heartbeatFrequencyMS: 30000, // Check server every 30 seconds
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Log database name
    const dbName = mongoose.connection.name;
    console.log(`📦 Connected to database: ${dbName}`);
    
    // Set up error handlers for the connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:');
    console.error('Error details:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error(`
⚠️ Could not connect to MongoDB. Please check:
1. Is MongoDB installed? Run 'mongod --version' to check
2. Is MongoDB service running? Start it with:
   - Windows: Open Services app and start MongoDB
   - Or run: mongod --dbpath="C:/data/db"
3. Is port 27017 available?
`);
    }
    
    // Don't exit the process, let it retry
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to database with retries
connectDB().catch(err => {
  console.error('Initial connection attempt failed:', err.message);
  console.log('🔄 Will keep retrying in the background...');
});

// Routes
app.use('/api/users', userAuthRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/pickup-requests', pickupRequestRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
