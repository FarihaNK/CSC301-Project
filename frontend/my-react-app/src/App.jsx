import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserProfile from "./pages/UserProfile";
import AboutPage from "./pages/AboutPage";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import UserJoin from "./pages/UserJoin";
import NavBar from "./components/Navbar";
import PSidebar from "./components/PSidebar";
import ASidebar from "./components/ASidebar";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import FamilyHistory from "./pages/FamilyHistory";
import AdminDashboard from './pages/AdminDashboard'
import FormDashboard from './pages/Forms'; // Your main page component
import Prescription from './pages/Prescription'; // Prescription page
import BloodTest from './pages/BloodTest'; // Blood Test page
import MRITest from './pages/MRITest'; // MRI Test page
import CTScan from './pages/CTScan'; // CT Scan page
import Documents from './pages/upload'
import ChatboxInterface from './pages/ChatbotInterface';
import PasswordReset from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyPatientProfiles from "./pages/MyPatientProfiles";
import ListOfPatients from './pages/ListOfPatients';

function Layout() {
  const location = useLocation();

  // Define which paths should show the NavBar
  const showNavBar = !(
    location.pathname === "/userdashboard" ||
    location.pathname === "/admindashboard" ||
    location.pathname === "/forms" ||
    location.pathname === "/prescription" ||
    location.pathname === "/bloodtest" ||
    location.pathname === "/mri" ||
    location.pathname === "/ct" ||
    location.pathname === "/medassist" ||
    location.pathname === "/docUpload" ||
    location.pathname === "/forgetpassword" ||
    location.pathname === "/familyhistory" ||
    location.pathname === "/profile" ||
    location.pathname === "/mypatients" ||
    location.pathname === "/patientlist"
  );

  const adminSideBar = !(
    location.pathname === "/userdashboard" ||
    location.pathname === "/forgetpassword" ||
    location.pathname === "/familyhistory" ||
    location.pathname === "/profile" 
  );

  const showPSidebar = !showNavBar && !adminSideBar;
  const showASidebar = !showNavBar;

  // return (
  //   <>
  //     {/* {showPSidebar && <PSidebar />} Show Sidebar for dashboard pages */}
  //     {showNavBar && <NavBar />} {/* Conditionally render NavBar */}
  //   </>
  // );

  return (
    <>
      {/* Conditionally render the sidebar */}
      {showPSidebar && <PSidebar />}
      {showASidebar && <ASidebar />}
      {showNavBar && <NavBar />} {/* Conditionally render NavBar */}

      {/* Main Content Area */}
      <div className={`main-content ${showPSidebar ? 'with-sidebar' : ''}`}>
        {/* Content will go here */}
      </div>
      <div className={`main-content ${showASidebar ? 'with-sidebar' : ''}`}>
        {/* Content will go here */}
      </div>
    </>
  );

  // return (
  //   <div className="app-layout">
  //     {showNavBar && <header className="nav-container"><NavBar /></header>}
  //     <div className="content-area">
  //       {showPSidebar && <aside className="sidebar-container"><PSidebar /></aside>}
  //       <main className={`main-content ${showPSidebar ? 'with-sidebar' : ''}`}>
  //         {/* Content will go here */}
  //       </main>
  //     </div>
  //   </div>
  // );
}

function App() {
  return (
    <Router>
      <Layout />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contactpage" element={<ContactPage />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/getstarted" element={<UserJoin />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/familyhistory" element={<FamilyHistory />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} /> {/* This is the main dashboard */}
        <Route path="/forms" element={<FormDashboard />} /> {/* This is the main dashboard */}

        {/* Individual Routes for each page */}
        <Route path="/prescription" element={<Prescription />} />
        <Route path="/bloodtest" element={<BloodTest />} />
        <Route path="/mri" element={<MRITest />} />
        <Route path="/ct" element={<CTScan />} />
        <Route path="/medassist" element={<ChatboxInterface />} /> {}
        <Route path="/docUpload" element={<Documents />} /> {}
        <Route path="/forgetpassword" element={<PasswordReset />} /> {}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/mypatients" element={<MyPatientProfiles />} />
        <Route path="/patientlist" element={<ListOfPatients />} /> {}
      </Routes>
    </Router>
  );
}
export default App;
