const Patient = require("../models/Patient");

// Create a new patient profile
exports.createPatient = async (req, res) => {
  try {
    const { fullName, phoneNumber, dob, healthCardNumber, address, doctorId } = req.body;

    // Ensure required fields are provided
    if (!fullName || !phoneNumber || !dob || !healthCardNumber || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPatient = new Patient({
      userId: req.user.id,  // Extracted from authMiddleware
      fullName,
      phoneNumber,
      dob,
      healthCardNumber,
      address,
      doctorId: doctorId || null,
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
    const { fullName, phoneNumber, dob, healthCardNumber, emergencyContact, isDependent } = req.body;

    if (fullName) patient.fullName = fullName;
    if (phoneNumber) patient.phoneNumber = phoneNumber;
    if (dob) patient.dob = dob;
    if (healthCardNumber) patient.healthCardNumber = healthCardNumber;
    if (emergencyContact) patient.emergencyContact = emergencyContact;
    if (isDependent !== undefined) patient.isDependent = isDependent;

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
