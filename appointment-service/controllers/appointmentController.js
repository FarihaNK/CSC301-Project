const Appointment = require("../models/Appointment");

// Fetch Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create Appointment
exports.createAppointment = async (req, res) => {
    try {
      const { title, description, date, appointmentTime } = req.body;

      // Ensure user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: No user ID found" });
      }
      if (!title || !date || !appointmentTime) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const newAppointment = await Appointment.create({
        title,
        description,
        date,
        appointmentTime,
        userId: req.user.id, // Ensure user ID is assigned
      });

      res.status(201).json(newAppointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  // Update Appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params.id;
    const { title, description, date, appointmentTime } = req.body;

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    // Validate required fields
    if (!title || !date || !appointmentTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the existing appointment
    const existingAppointment = await Appointment.findByPk(id);

    // Check if appointment exists
    if (!existingAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the user owns the appointment
    if (existingAppointment.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this appointment" });
    }

    // Update the appointment
    const updatedAppointment = await existingAppointment.update({
      title,
      description,
      date,
      appointmentTime
    });

    res.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};