import React from "react";
import "./LandingPage.css";
import logo from "../assets/logo.png";

const LandingPage = () => {
  return (
    <div className="container">

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="MedAssist Logo" className="logo" />
          <h1 className="app-name">MedAssist</h1>
        </div>
        <ul className="nav">
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><button className="nav-button">Login</button></li>
        </ul>
      </nav>

      {/* MainScreen Section */}
      <header className="mainscreen">
        <div className="content">
          <h1>Where Health Meets Innovation</h1>
          <p className="tagline">Your trusted companion in healthcare.</p>
          <button className="cta-button">Get Started</button>
        </div>
      </header>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 MedAssist. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;