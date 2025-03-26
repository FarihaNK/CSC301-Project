require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/tasks", taskRoutes);

// Start server after database connection
sequelize.sync({ force: true })
  .then(() => {
    console.log("Database has been reset and synced!");
    app.listen(5005, () => console.log("To-Do List Service running on port 5005"));
  })
  .catch(err => console.error("Database sync error:", err));