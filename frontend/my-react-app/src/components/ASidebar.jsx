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
          <li onClick={() => navigate("/mypatients")}>Patients</li>
          <li>Appointments</li>
          <li>Doc Upload</li>
<<<<<<< HEAD
          <li onClick={() => navigate("/todo")}>To-do List</li>
=======
          <li>To-do List</li>
>>>>>>> 7ab3e73dbf512e74971acd40dec3d390c4a67996
          <li onClick={() => navigate("/medassist")}>MedAssistant</li>
          <li onClick={() => navigate("/")}>Logout</li>
        </ul>
      </nav>
    </aside>
  );
};

export default PSidebar;
