// routes/schools.js
const express = require('express');
const schoolController = require('../controllers/schoolController');
const router = express.Router();

// Add school route
router.post('/addSchool', schoolController.addSchool);

// List schools route
router.get('/listSchools', schoolController.listSchools);

module.exports = router;