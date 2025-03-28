const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

const {
  createFamilyHistory,
  getFamilyHistory,
  deleteFamilyHistory,
} = require("../contollers/familyHistoryController");

router.post("/", authMiddleware, requireRole('patient'), createFamilyHistory);           // Create family history
router.get("/:patientId", authMiddleware, getFamilyHistory);     // Get history for patient
router.delete("/:patientId", authMiddleware, requireRole('patient'), deleteFamilyHistory); // Delete all history for patient

module.exports = router;
