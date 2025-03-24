const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dob: { type: Date, required: true },
  healthCardNumber: { type: String, required: true },
  address: {type: String, required: true},
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
