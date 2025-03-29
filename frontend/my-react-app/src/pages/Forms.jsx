import React, { useState, useEffect } from "react";
import "./Forms.css";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const FormDashboard = () => {
  return (
    <div className="dashboard">

      {/* Main Content */}
      <main className="content">
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