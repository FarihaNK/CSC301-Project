const Patient = require("../models/Patient");

// Create a new patient profile
exports.createPatient = async (req, res) => {
  try {
    const { fullName, dob, gender, medicalHistory, emergencyContact, isDependent } = req.body;
    const newPatient = new Patient({
      userId: req.user.id,  // Extracted from authMiddleware
      fullName,
      dob,
      gender,
      medicalHistory,
      emergencyContact,
      isDependent,
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient profile created successfully", patient: newPatient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all patient profiles for logged-in user
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.user.id });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get a single patient profile by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient || patient.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a patient profile
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient || patient.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(patient, req.body);
    await patient.save();

    res.json({ message: "Patient profile updated", patient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a patient profile
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient || patient.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await patient.deleteOne();
    res.json({ message: "Patient profile deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
