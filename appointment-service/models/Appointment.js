const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Appointment = sequelize.define("Appointment", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    appointmentTime: { type: DataTypes.TIME, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false },
  }, { tableName: "Appointments", timestamps: true });
  
  module.exports = Appointment;
  