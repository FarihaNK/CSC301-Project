const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createFamilyHistory,
  getFamilyHistory,
  deleteFamilyHistory,
} = require("../contollers/familyHistoryController");

router.post("/", authMiddleware, createFamilyHistory);           // Create family history
router.get("/:patientId", authMiddleware, getFamilyHistory);     // Get history for patient
router.delete("/:patientId", authMiddleware, deleteFamilyHistory); // Delete all history for patient

module.exports = router;
