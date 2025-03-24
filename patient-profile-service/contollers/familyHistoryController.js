const FamilyMember = require("../models/FamilyMember");

// Create family history entries for a patient
exports.createFamilyHistory = async (req, res) => {
  try {
    const { patientId, familyMembers } = req.body;

    if (!patientId || !Array.isArray(familyMembers)) {
      return res.status(400).json({ message: "Missing patientId or familyMembers array" });
    }

    const savedMembers = await Promise.all(
      familyMembers.map((member) => {
        return FamilyMember.create({
          patientId,
          relation: member.relation,
          conditions: member.conditions || [],
        });
      })
    );

    res.status(201).json({ message: "Family history saved", family: savedMembers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get family history for a specific patient
exports.getFamilyHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const familyMembers = await FamilyMember.find({ patientId });
    res.json(familyMembers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Optional: Delete all family history for a patient
exports.deleteFamilyHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    await FamilyMember.deleteMany({ patientId });
    res.json({ message: "Family history deleted for patient" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
