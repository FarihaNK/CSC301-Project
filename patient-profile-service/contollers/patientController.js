const Patient = require("../models/Patient");
const User = require("../models/User");

// Create a new patient profile
exports.createPatient = async (req, res) => {
  try {
    const { fullName, phoneNumber, dob, healthCardNumber, address, doctorId, isDependant } = req.body;

    // Ensure required fields are provided
    if (!fullName || !phoneNumber || !dob || !healthCardNumber || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert string to boolean if needed
    const dependantStatus = typeof isDependant === "string" 
      ? isDependant === "true" 
      : !!isDependant;

    // Check if user already has a non-dependant patient
    if (!dependantStatus) {
      const existingNonDep = await Patient.findOne({
        userId: req.user.id,
        isDependant: false,
      });

      if (existingNonDep) {
        return res.status(400).json({
          message: "You already have a primary (non-dependant) patient profile.",
        });
      }
    }

    const newPatient = new Patient({
      userId: req.user.id,  // Extracted from authMiddleware
      fullName,
      phoneNumber,
      dob,
      healthCardNumber,
      address,
      doctorId: doctorId || null,
      isDependant: dependantStatus,
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

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    if (patient.userId.toString() !== req.user.id) {
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

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    if (patient.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Allow updating only certain fields
    const { fullName, phoneNumber, dob, healthCardNumber, emergencyContact, isDependant } = req.body;

    if (fullName) patient.fullName = fullName;
    if (phoneNumber) patient.phoneNumber = phoneNumber;
    if (dob) patient.dob = dob;
    if (healthCardNumber) patient.healthCardNumber = healthCardNumber;
    if (emergencyContact) patient.emergencyContact = emergencyContact;
    if (isDependant !== undefined) patient.isDependant = isDependant;

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

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    if (patient.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await patient.deleteOne();
    res.json({ message: "Patient profile deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPatientsByDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;
    console.log("Doctor ID from token:", doctorId);

    const patients = await Patient.find({ doctorId }).populate("userId", "name email");

    console.log("Patients found:", patients.length);
    res.json(patients);
  } catch (err) {
    console.error("Error in getPatientsByDoctor:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};