import React, { useState, useEffect } from "react";
import "./Forms.css";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const FormDashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Patients</li>
            <li>Schedule</li>
            <li>MedAssistant</li>
            <li>Personal Profile</li> {/* New Button */}
            <li>Settings</li> {/* Settings Button */}
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        {/* Top Bar */}
        <header className="top-bar">
          <input
            type="text"
            placeholder="Search for anything..."
            className="search-bar"
          />
          <div className="navigation">
            {/* <button>Dashboard</button>
            <button>Forms</button> */}
            <Link to="/dashboard">
              <button>Dashboard</button>
            </Link>
            <Link to="/forms">
              <button>Forms</button>
            </Link>
            <button className="Doc">Document Upload</button>
            <button>To-Do</button>
          </div>
        </header>

        {/* Main Section */}
        <section className="main-section">
            <div className="widget">
                <Link to="/prescription">
                    <h3>Prescription</h3>
                    <div className="placeholder"></div>
                </Link>
            </div>
            <div className="widget">
                <Link to="/bloodtest"> 
                    <h3>Blood Test</h3>
                    <div className="placeholder"></div>
              </Link>
            </div>
            <div className="widget">
                <Link to="/mri">
                    <h3>MRI</h3>
                    <div className="placeholder"></div>
                </Link>
            </div>
            <div className="widget">
                <Link to="/ct">
                    <h3>CT</h3>
                    <div className="placeholder"></div>
                </Link>
            </div>
        </section>
      </main>
    </div>
  );
};

export default FormDashboard; 