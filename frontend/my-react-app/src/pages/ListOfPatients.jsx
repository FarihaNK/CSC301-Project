import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListOfPatients.css";
import logo from "../assets/logo.png";
import default_profile from "../assets/default_profile.jpg";

const ListOfPatients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
    const [medicalHistory, setMedicalHistory] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

  const handleViewMedicalHistory = async (patient) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5002/api/medicalhistory/${patient._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPatient(patient);
      setMedicalHistory(res.data);

      setEditForm({
        conditions: res.data?.conditions || [],
        otherCondition: "",
      });

    } catch (err) {
      setSelectedPatient(patient);
      setMedicalHistory(null); // Or set as an empty history object
      if (err.response && err.response.status === 404) {
        console.warn("No medical history for this patient.");
      } else {
        console.error("Error fetching medical history:", err);
      }
      setEditForm({
        conditions: [],
        otherCondition: "",
      });


    } finally {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
    setMedicalHistory(null);
  };

  const [editForm, setEditForm] = useState({
    conditions: [],
    otherCondition: "",
  });

  return (
    <div className="dashboard">

      <main className="content">
        <section className="main-section">
          <h2>Patients</h2>
          <div className="table-container">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>Age</th>
                  <th>Health Card</th>
                  <th> </th>
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
                    <td>{new Date(p.dob).toLocaleDateString()}</td>
                    <td>{calculateAge(p.dob)}</td>
                    <td>{p.healthCardNumber}</td>
                    <td>
                      <button className="access-btn" onClick={() => handleViewMedicalHistory(p)}>Access Medical Data</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {showModal && selectedPatient && (
          <div className="overlay">
            <div className="modal">
              <button className="close-btn" onClick={closeModal}>✕</button>
              <h3>Medical History for {selectedPatient.fullName}</h3>

              {medicalHistory && medicalHistory.conditions && medicalHistory.conditions.length > 0 ? (
                <ul>
                  {medicalHistory.conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              ) : (
                <p>No medical conditions recorded.</p>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const token = localStorage.getItem("token");
                    const updatedConditions = [
                      ...new Set([
                        ...editForm.conditions,
                        ...(editForm.otherCondition ? [editForm.otherCondition] : []),
                      ]),
                    ];

                    await axios.post(
                      `http://localhost:5002/api/medicalhistory`,
                      {
                        patientId: selectedPatient._id,
                        conditions: updatedConditions,
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    alert("Medical history updated!");
                    setMedicalHistory({ conditions: updatedConditions });
                  } catch (err) {
                    console.error("Failed to update history:", err);
                    alert("Update failed.");
                  }
                }}
              >
                <h4>Edit Medical History</h4>
                <div className="conditions-checkboxes">
                  {[
                    "Heart Disease",
                    "Diabetes",
                    "Cancer",
                    "Mental Health Disorders",
                    "Neurological Disorders",
                    "Autoimmune Diseases",
                    "High Blood Pressure",
                    "Obesity",
                    "Asthma",
                    "Other",
                  ].map((condition) => (
                    <label key={condition}>
                      <input
                        type="checkbox"
                        value={condition}
                        checked={editForm.conditions.includes(condition)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const value = e.target.value;
                          setEditForm((prev) => ({
                            ...prev,
                            conditions: checked
                              ? [...prev.conditions, value]
                              : prev.conditions.filter((c) => c !== value),
                          }));
                        }}
                      />
                      {condition}
                    </label>
                  ))}

                  {editForm.conditions.includes("Other") && (
                    <div>
                      <label>Please specify:</label>
                      <input
                        type="text"
                        value={editForm.otherCondition}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            otherCondition: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
                <button type="submit">Save</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListOfPatients;
