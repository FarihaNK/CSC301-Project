const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  conditions: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);
