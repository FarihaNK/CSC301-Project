require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/appointments", appointmentRoutes);

// Start server after database connection
sequelize.sync({ force: true })
  .then(() => {
    console.log("Database has been reset and synced!");
    app.listen(5004, () => console.log("Appointment Service running on port 5004"));
  })
  .catch(err => console.error("Database sync error:", err));