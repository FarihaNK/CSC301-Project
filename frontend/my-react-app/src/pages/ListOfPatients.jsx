import React, { useState } from "react";
import "./ListOfPatients.css";
import logo from "../assets/logo.png";

import nice_elephant from "../assets/nice_elephant.png";
import iron_man from "../assets/iron_man.jpeg";
import harry_potter from "../assets/harry_potter.jpg";
import michael_jackson from "../assets/michael_jackson.jpeg";
import lebron_james from "../assets/lebron_james.png";
import default_profile from "../assets/default_profile.jpg";

const patients_test = [
  { id: 0, name: "John Doe", age: 69, image: default_profile },   // use default_profile for individuals with no profile pic set

  { id: 1, name: "Nice Elephant", age: 25, image: nice_elephant },
  { id: 2, name: "Iron Man", age: 52, image: iron_man },
  { id: 3, name: "Harry Potter", age: 37, image: harry_potter },
  { id: 4, name: "Michael Jackson", age: 50, image: michael_jackson },
  { id: 5, name: "LeBron James", age: 40, image: lebron_james },
  
  { id: 6, name: "Nice Elephant", age: 25, image: nice_elephant },
  { id: 7, name: "Iron Man", age: 52, image: iron_man },
  { id: 8, name: "Harry Potter", age: 37, image: harry_potter },
  { id: 9, name: "Michael Jackson", age: 50, image: michael_jackson },
  { id: 10, name: "LeBron James", age: 40, image: lebron_james },

  { id: 11, name: "Nice Elephant", age: 25, image: nice_elephant },
  { id: 12, name: "Iron Man", age: 52, image: iron_man },
  { id: 13, name: "Harry Potter", age: 37, image: harry_potter },
  { id: 14, name: "Michael Jackson", age: 50, image: michael_jackson },
  { id: 15, name: "LeBron James", age: 40, image: lebron_james }
];


const ListOfPatients = () => {
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
                {patients_test.map((patient) => (
                  <tr key={patient.id}>
                  <td>
                    <div className="patient-info">
                      <img src={patient.image} alt="Profile" className="profile-pic" />
                      <span>{patient.name}</span>
                    </div>
                  </td>
                  <td>{patient.age}</td>
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
