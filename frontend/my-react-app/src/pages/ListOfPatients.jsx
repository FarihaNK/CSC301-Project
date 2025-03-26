import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListOfPatients.css";
import logo from "../assets/logo.png";
import default_profile from "../assets/default_profile.jpg";

const ListOfPatients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5002/api/patients/by-doctor", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to fetch doctor patients:", err);
      }
    };

    fetchPatients();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Medical History</li>
            <li>MedAssistant</li>
            <li>Appointments</li>
            <li>Add Patient Profile</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <header className="top-bar">
          <input type="text" placeholder="Search for anything..." className="search-bar" />
          <div className="navigation">
            <button>Dashboard</button>
            <button>Insights</button>
            <button>Reports</button>
            <button className="Medications">Medications</button>
          </div>
        </header>

        <section className="main-section">
          <h2>Patients</h2>
          <div className="table-container">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="patient-info">
                        <img src={default_profile} alt="Profile" className="profile-pic" />
                        <span>{p.fullName}</span>
                      </div>
                    </td>
                    <td>{calculateAge(p.dob)}</td>
                    <td>
                      <button className="access-btn">Access Medical Data</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ListOfPatients;
