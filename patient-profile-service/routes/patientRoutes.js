const express = require("express");
const { createPatient, getPatients, getPatientById, updatePatient, deletePatient } = require("../contollers/patientController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a patient profile (User must be authenticated)
router.post("/", authMiddleware, createPatient);

// Get all patient profiles for the logged-in user
router.get("/", authMiddleware, getPatients);

// Get a single patient profile
router.get("/:id", authMiddleware, getPatientById);

// Update a patient profile
router.put("/:id", authMiddleware, updatePatient);

// Delete a patient profile
router.delete("/:id", authMiddleware, deletePatient);

module.exports = router;
