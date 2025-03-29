import React from "react";
import "./LandingPage.css";
import logo from "../assets/logo.png";

const LandingPage = () => {
  return (
    <div className="container">
      {/* MainScreen Section */}
      <header className="mainscreen">
        <div className="content" id='middlescreen'>
          <h1>Where Health Meets Innovation</h1>
          <p className="tagline">Your trusted companion in healthcare.</p>
          {/* <button className="cta-button">Get Started</button> */}
          <button className="cta-button" onClick={() => (window.location.href = "/getstarted")}>
                Get Started
            </button>
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