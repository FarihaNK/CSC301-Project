const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  relation: { type: String, required: true },
  conditions: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("FamilyMember", familyMemberSchema);
