import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListOfPatients.css"; // Optional styling
import default_profile from "../assets/default_profile.jpg";
import logo from "../assets/logo.png";

const MyPatientProfiles = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5002/api/patients", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfiles(res.data);
      } catch (err) {
        console.error("Failed to fetch patient profiles:", err);
      }
    };

    fetchProfiles();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="dashboard">
      {/* <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Dashboard</li>
            <li>MedAssistant</li>
            <li>Appointments</li>
            <li>My Patients</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside> */}

      <main className="content">
        {/* <header className="top-bar">
          <input type="text" placeholder="Search..." className="search-bar" />
        </header> */}

        <section className="main-section">
          <h2>My Patient Profiles</h2>
          {profiles.length === 0 ? (
            <p>No patient profiles created yet.</p>
          ) : (
            <div className="table-container">
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>DOB</th>
                    <th>Age</th>
                    <th>Health Card</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="patient-info">
                          <img src={default_profile} alt="Profile" className="profile-pic" />
                          <span>{p.fullName}</span>
                        </div>
                      </td>
                      <td>{new Date(p.dob).toLocaleDateString()}</td>
                      <td>{calculateAge(p.dob)}</td>
                      <td>{p.healthCardNumber}</td>
                      <td>{p.phoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyPatientProfiles;
