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

  return (
    <aside className="sidebar">
      {/* Make the logo clickable */}
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'default'}}>
        <img src={logo} alt="Logo" />
      </div>

      <nav className="menu">
        <ul>
          <li>Patients</li>
          <li>Schedule</li>
          <li onClick={() => navigate("/medassist")}>MedAssistant</li>
          <li onClick={() => navigate("/")}>Logout</li>
        </ul>
      </nav>
    </aside>
  );
};

export default PSidebar;
