const MedicalHistory = require("../models/MedicalHistory");

exports.createOrUpdateMedicalHistory = async (req, res) => {
  try {
    const { patientId, conditions } = req.body;

    if (!patientId || !Array.isArray(conditions)) {
      return res.status(400).json({ message: "Missing patientId or conditions array" });
    }

    // Either update existing or create new
    const history = await MedicalHistory.findOneAndUpdate(
      { patientId },
      { $set: { conditions } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Medical history saved", history });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const history = await MedicalHistory.findOne({ patientId });

    if (!history) {
      return res.status(404).json({ message: "No medical history found for this patient" });
    }

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    await MedicalHistory.deleteOne({ patientId });
    res.json({ message: "Medical history deleted for patient" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
