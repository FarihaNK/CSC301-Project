import React, { useState } from "react";
import "./AboutPage.css";
import logo from "../assets/logo.png";

const AboutPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: "About MedAssist",
      content:
        "Welcome to MedAssist, your trusted health companion on the journey to better wellness. We simplify the way you manage medical information, appointments, and overall well-being. MedAssist empowers you to make informed health decisions with ease.",
    },
    {
      title: "Our Vision",
      content:
        "Our mission is to revolutionize healthcare through accessibility and personalization. Using cutting-edge technology and a commitment to privacy, we provide a platform that keeps you in control of your health journey.",
    },
    {
      title: "Your Health, Our Priority",
      content:
        "We prioritize your privacy with industry-leading encryption. Whether you're managing a chronic condition or tracking wellness goals, MedAssist helps you stay organized while keeping your data secure.",
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

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

      {/* Carousel Section */}
      <header className="mainscreen">
        <div className="carousel">
          <button className="carousel-button left" onClick={handlePrev}>
            &#8249;
          </button>
          <div className="carousel-slide">
            <h2>{slides[currentIndex].title}</h2>
            <p>{slides[currentIndex].content}</p>
          </div>
          <button className="carousel-button right" onClick={handleNext}>
            &#8250;
          </button>
        </div>
      </header>

      {/* Footer */}
      <footer>
        <p>&copy; {new Date().getFullYear()} MedAssist. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;