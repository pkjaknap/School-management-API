// server.js
const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/schools');
const { testConnection } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', schoolRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to School Management API' });
});

// Start server and test database connection
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Test database connection
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('Ready to accept requests.');
  } else {
    console.log('Server running, but database connection failed.');
  }
});