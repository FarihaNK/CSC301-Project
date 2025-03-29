// import React from "react";
// import "./Layout.css";
// import logo from "../assets/logo.png";

// const Layout = ({ children, activePage, onChangePage }) => {
//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li
//               className={activePage === "upload" ? "active" : ""}
//               onClick={() => onChangePage("upload")}
//             >
//               Document Upload
//             </li>
//             <li
//               className={activePage === "chatbot" ? "active" : ""}
//               onClick={() => onChangePage("chatbot")}
//             >
//               MedAssistant
//             </li>
//             <li>Patients</li>
//             <li>Schedule</li>
//             <li>Personal Profile</li>
//             <li>Settings</li>
//             <li className="logout">Logout</li>
//           </ul>
//         </nav>
//       </aside>
//       <div className="main-container">
//         <header className="top-bar">
//           <input
//             type="text"
//             placeholder="Search for anything..."
//             className="search-bar"
//           />
//           <div className="navigation">
//             <button>Dashboard</button>
//             <button>Insights</button>
//             <button>Reports</button>
//             <button className="Medications">Medications</button>
//           </div>
//         </header>
//         <main className="content">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Layout;


//VERSION 3.1 TRYING TO FIX LAYOUT ( SEPERATED SIDEBAR/NAVIGATION)

// src/components/Layout.jsx
// import React from "react";
// import "./Layout.css";
// import logo from "../assets/logo.png";

// const Layout = ({ children }) => {
//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li>Patients</li>
//             <li>Schedule</li>
//             <li>Document Upload</li>
//             <li>To-Do</li>
//             <li>Settings</li>
//             <li className="logout">Logout</li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Container */}
//       <div className="main-container">
//         {/* Top Bar */}
//         <header className="top-bar">
//           <input
//             type="text"
//             placeholder="Search for anything..."
//             className="search-bar"
//           />
//           <div className="navigation">
//             <button>Dashboard</button>
//             <button>Insights</button>
//             <button>Reports</button>
//             <button className="Medications">Medications</button>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="content">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Layout;



//VERSION 100: idk anymoer : 
import React from "react";
import "./Layout.css";
import logo from "../assets/logo.png";

const Layout = ({ children }) => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      {/* <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Patients</li>
            <li>Schedule</li>
            <li>Document Upload</li>
            <li>To-Do</li>
            <li>Settings</li>
            <li className="logout">Logout</li>
          </ul>
        </nav>
      </aside> */}

      {/* Main Container */}
      <div className="main-container">
        {/* Top Bar */}
        {/* <header className="top-bar">
          <input
            type="text"
            placeholder="Search for anything..."
            className="search-bar"
          />
          <div className="navigation">
            <button>Dashboard</button>
            <button>Insights</button>
            <button>Reports</button>
            <button className="Medications">Medications</button>
          </div>
        </header> */}

        {/* Content Area */}
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
