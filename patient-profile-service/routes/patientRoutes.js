const express = require("express");
const { createPatient, getPatients, getPatientById, updatePatient, deletePatient, getPatientsByDoctor} = require("../contollers/patientController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPatient);
router.get("/", authMiddleware, getPatients);
router.get("/by-doctor", authMiddleware, getPatientsByDoctor);
router.get("/:id", authMiddleware, getPatientById);
router.put("/:id", authMiddleware, updatePatient);
router.delete("/:id", authMiddleware, deletePatient);

module.exports = router;
