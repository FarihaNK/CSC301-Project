const express = require("express");
const { createAppointment, getAppointments, updateAppointment } = require("../controllers/appointmentController");
const { authMiddleware, requireRole } = require('../middleware/authmiddleware');

const router = express.Router();

router.post("/", authMiddleware, createAppointment);
router.get("/", authMiddleware, getAppointments);
router.put("/:id", authMiddleware, updateAppointment);

module.exports = router;
