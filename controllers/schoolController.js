// controllers/schoolController.js
// controllers/schoolController.js
const { pool } = require("../config/db");

// Validation function
const validateSchoolData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("School name is required");
  }

  if (!data.address || data.address.trim() === "") {
    errors.push("Address is required");
  }

  if (data.latitude === undefined || isNaN(parseFloat(data.latitude))) {
    errors.push("Valid latitude is required");
  } else {
    const lat = parseFloat(data.latitude);
    if (lat < -90 || lat > 90) {
      errors.push("Latitude must be between -90 and 90");
    }
  }

  if (data.longitude === undefined || isNaN(parseFloat(data.longitude))) {
    errors.push("Valid longitude is required");
  } else {
    const lng = parseFloat(data.longitude);
    if (lng < -180 || lng > 180) {
      errors.push("Longitude must be between -180 and 180");
    }
  }

  return errors;
};

// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

exports.addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validate input data
    const validationErrors = validateSchoolData({
      name,
      address,
      latitude,
      longitude,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    // Insert school into database
    const [result] = await pool.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, parseFloat(latitude), parseFloat(longitude)]
    );

    res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the school",
      error: error.message,
    });
  }
};

exports.listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validate user coordinates
    if (
      !latitude ||
      !longitude ||
      isNaN(parseFloat(latitude)) ||
      isNaN(parseFloat(longitude))
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required",
      });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    // Validate coordinate ranges
    if (userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude must be between -90 and 90, and longitude must be between -180 and 180",
      });
    }

    // Fetch all schools from database
    const [schools] = await pool.execute("SELECT * FROM schools");

    // Calculate distance for each school and sort
    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance: parseFloat(distance.toFixed(2)), // Distance in km, rounded to 2 decimal places
      };
    });

    // Sort schools by distance (closest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error("Error listing schools:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching schools",
      error: error.message,
    });
  }
};
