require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const patientRoutes = require("./routes/patientRoutes.js");
const medicalHistoryRoutes = require("./routes/medicalHistoryRoutes.js");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/medicalhistory", medicalHistoryRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Patient Profile Service connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Patient Profile Service running on port ${PORT}`));
