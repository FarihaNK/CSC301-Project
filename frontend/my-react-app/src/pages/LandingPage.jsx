// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./LandingPage.css";

// const LandingPage = () => {
//   const navigate = useNavigate(); // Hook for navigation

//   return (
//     <div className="container">
//       <nav className="navbar">
//         <div className="logo-container">
//           <h1 className="app-name">MedAssist</h1>
//         </div>
//         <ul className="nav">
//           <li>
//             <button className="nav-button" onClick={() => navigate("/about")}>
//               About
//             </button>
//           </li>
//         </ul>
//       </nav>

//       <header className="mainscreen">
//         <div className="content">
//           <h1>Welcome to MedAssist</h1>
//           <p className="tagline">Your health companion</p>
//         </div>
//       </header>

//       <footer>
//         <p>&copy; 2025 MedAssist. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
// import React from "react";
// import "./LandingPage.css";
// import logo from "../assets/logo.png";

// const LandingPage = () => {
//   return (
//     <div className="container">

//       {/* Navigation Bar */}
//       <nav className="navbar">
//         <div className="logo-container">
//           <img src={logo} alt="MedAssist Logo" className="logo" />
//           <h1 className="app-name">MedAssist</h1>
//         </div>
//         <ul className="nav">
//           {/* <li><a href="#about">About</a></li>
//           <li><a href="#contact">Contact</a></li>
//           <li><button className="nav-button">Login</button></li> */}
//           <li>
//              <button className="nav-button" onClick={() => navigate("/about")}>
//                About
//              </button>
//              <button className="nav-button" onClick={() => navigate("/about")}>
//                Contact
//              </button>
//              <button className="nav-button" onClick={() => navigate("/login")}>
//                Login
//              </button>
//           </li>
//         </ul>
//       </nav>

//       {/* MainScreen Section */}
//       <header className="mainscreen">
//         <div className="content">
//           <h1>Where Health Meets Innovation</h1>
//           <p className="tagline">Your trusted companion in healthcare.</p>
//           <button className="cta-button">Get Started</button>
//         </div>
//       </header>

//       {/* Footer */}
//       <footer>
//         <p>&copy; 2025 MedAssist. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;

// import React from "react";
// import "./LandingPage.css";
// import logo from "../assets/logo.png";

// const LandingPage = () => {
//   return (
//     <div className="container">
//       {/* MainScreen Section */}
//       <header className="mainscreen">
//         <div className="content">
//           <h1>Where Health Meets Innovation</h1>
//           <p className="tagline">Your trusted companion in healthcare.</p>
//           <button className="cta-button">Get Started</button>
//         </div>
//       </header>

//       {/* Footer */}
//       <footer>
//         <p>&copy; 2025 MedAssist. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;

import React from "react";
import "./LandingPage.css";
import logo from "../assets/logo.png";

const LandingPage = () => {
  return (
    <div className="container">
      {/* MainScreen Section */}
      <header className="mainscreen">
        <div className="content">
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