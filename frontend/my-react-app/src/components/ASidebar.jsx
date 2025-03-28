import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./PSidebar.css";

const PSidebar = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle logo click and redirect to user dashboard
  const handleLogoClick = () => {
    navigate("/admindashboard"); // Navigate to user dashboard
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* Make the logo clickable */}
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'default' }}>
        <img src={logo} alt="Logo" />
      </div>

      <nav className="menu">
        <ul>
          <li onClick={() => navigate("/mypatients")}>Patients</li>
          <li>Appointments</li>
          <li>Doc Upload</li>
          <li onClick={() => navigate("/todo")}>To-do List</li>
          <li onClick={() => navigate("/medassist")}>MedAssistant</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
    </aside>
  );
};

export default PSidebar;
