const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

const {
  createOrUpdateMedicalHistory,
  getMedicalHistory,
  deleteMedicalHistory,
} = require("../contollers/medicalHistoryController");

router.post("/", authMiddleware, createOrUpdateMedicalHistory);
router.get("/:patientId", authMiddleware, getMedicalHistory);
router.delete("/:patientId", authMiddleware, requireRole('patient'), deleteMedicalHistory);

module.exports = router;
