const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define("Task", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  task: { type: DataTypes.STRING, allowNull: false },
}, { tableName: "Tasks", timestamps: true });

module.exports = Task;
