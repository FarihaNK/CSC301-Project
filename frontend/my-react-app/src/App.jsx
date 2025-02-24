// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import AdminDashboard from "./pages/AdminDashboard";
// function App()
// {
//     return <AdminDashboard />;
// }
// export default App;

// import FormDashboard from "./pages/Forms";
// function App()
// {
//     return <FormDashboard />;
// }
// export default App;
import React from 'react';
import { BrowserRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard'
import FormDashboard from './pages/Forms'; // Your main page component
import Prescription from './pages/Prescription'; // Prescription page
import BloodTest from './pages/BloodTest'; // Blood Test page
import MRITest from './pages/MRITest'; // MRI Test page
import CTScan from './pages/CTScan'; // CT Scan page

const App = () => {
    return (
        <BrowserRouter> {/* Wrap everything with Router */}
            <Routes> {/* Use Routes to define your routes */}
            {/* Default Route */}
            <Route path="/" element={<AdminDashboard />} /> {/* This is the main dashboard */}
            <Route path="/dashboard" element={<AdminDashboard />} /> {/* This is the main dashboard */}
            <Route path="/forms" element={<FormDashboard />} /> {/* This is the main dashboard */}
                
            {/* Individual Routes for each page */}
            <Route path="/prescription" element={<Prescription />} />
            <Route path="/bloodtest" element={<BloodTest />} />
            <Route path="/mri" element={<MRITest />} />
            <Route path="/ct" element={<CTScan />} />
            </Routes>
        </BrowserRouter>
    );
  };
  
  export default App;
