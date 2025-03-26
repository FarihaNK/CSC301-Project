import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation} from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserProfile from "./pages/UserProfile";
import AboutPage from "./pages/AboutPage";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import UserJoin from "./pages/UserJoin";
import NavBar from "./components/Navbar";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from './pages/AdminDashboard'
import FormDashboard from './pages/Forms'; // Your main page component
import Prescription from './pages/Prescription'; // Prescription page
import BloodTest from './pages/BloodTest'; // Blood Test page
import MRITest from './pages/MRITest'; // MRI Test page
import CTScan from './pages/CTScan'; // CT Scan page
import Documents from './pages/upload'
import ChatboxInterface from './pages/ChatbotInterface';
import ListOfPatients from './pages/ListOfPatients'


function Layout(){
  const location = useLocation();

  // Define which paths should show the NavBar
  // const showNavBar = !(
  //   location.pathname === "/" ||
  //   location.pathname === "/home" ||
  //   location.pathname === "/about" ||
  //   location.pathname === "/contactpage" ||
  //   location.pathname === "/userlogin" ||
  //   location.pathname === "/adminlogin" ||
  //   location.pathname === "/getstarted" 
  // );
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
    location.pathname === "/patientlist"
  );

  return (
    <>
      {showNavBar && <NavBar />} {/* Conditionally render NavBar */}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contactpage" element={<ContactPage />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/getstarted" element={<UserJoin />} />
        <Route path="/profile" element={<UserProfile />} />
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
        <Route path="/patientlist" element={<ListOfPatients />} /> {}
      </Routes>
    </Router>
  );
}
export default App;
