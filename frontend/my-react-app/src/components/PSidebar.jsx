import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./PSidebar.css";

const PSidebar = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle logo click and redirect to user dashboard
  const handleLogoClick = () => {
    navigate("/userdashboard"); // Navigate to user dashboard
  };

  return (
    <aside className="sidebar">
      {/* Make the logo clickable */}
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'default'}}>
        <img src={logo} alt="Logo" />
      </div>

      <nav className="menu">
        <ul>
          <li>Medical History</li>
          <li>MedAssistant</li>
          <li onClick={() => navigate("/profile")}>Personal Profile</li>
          <li onClick={() => navigate("/familyhistory")}>Family History</li>
          <li onClick={() => navigate("/")}>Logout</li>
          {/* <li onClick={() => navigate("/mypatients")}>My Patients</li> */}
        </ul>
      </nav>
    </aside>
  );
};

export default PSidebar;
