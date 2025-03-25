const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['doctor', 'researcher', 'pharmacist', 'patient'], required: true },
    resetToken: String,
    resetTokenExpiry: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
