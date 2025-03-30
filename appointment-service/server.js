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

// Start server only if not testing
if (process.env.NODE_ENV !== "test") {
  sequelize.sync().then(() => {
    app.listen(5004, () =>
      console.log("Appointment Service running on port 5004")
    );
  });
}

module.exports = app;