import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyMedicalHistory.css";

const MyMedicalHistory = () => {
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [editForm, setEditForm] = useState({ conditions: [], otherCondition: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrimaryPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5002/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const nonDependant = res.data.find((p) => p.isDependant === false);
        if (!nonDependant) {
          setPatient(null);
          return;
        }

        setPatient(nonDependant);

        try {
          const historyRes = await axios.get(
            `http://localhost:5002/api/medicalhistory/${nonDependant._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMedicalHistory(historyRes.data);
          setEditForm({ conditions: historyRes.data.conditions || [], otherCondition: "" });
        } catch (historyErr) {
          if (historyErr.response?.status === 404) {
            console.warn("No medical history found.");
            setMedicalHistory({ conditions: [] });
            setEditForm({ conditions: [], otherCondition: "" });
          } else {
            throw historyErr;
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrimaryPatient();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient) return;

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
        { patientId: patient._id, conditions: updatedConditions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Medical history updated!");
      setMedicalHistory({ conditions: updatedConditions });
      setEditForm({ conditions: updatedConditions, otherCondition: "" });
    } catch (err) {
      console.error("Failed to update history:", err);
      alert("Update failed.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!patient) return <p>No primary (non-dependant) patient found.</p>;

  return (
    <div className="medical-history-page">
      <h1>My Medical History</h1>

      <section className="profile-info">
        <h2>Profile</h2>
        <p><strong>Name:</strong> {patient.fullName}</p>
        <p><strong>Phone:</strong> {patient.phoneNumber}</p>
        <p><strong>Date of Birth:</strong> {new Date(patient.dob).toLocaleDateString()}</p>
        <p><strong>Health Card:</strong> {patient.healthCardNumber}</p>
        <p><strong>Address:</strong> {patient.address}</p>
      </section>

      <section className="medical-info">
        <h2>Medical History</h2>
        {medicalHistory?.conditions?.length > 0 ? (
          <ul>{medicalHistory.conditions.map((c, i) => <li key={i}>{c}</li>)}</ul>
        ) : (
          <p>No medical conditions recorded.</p>
        )}
      </section>

      <section className="medical-form">
        <h2>Edit Medical History</h2>
        <form onSubmit={handleSubmit}>
          <div className="conditions-checkboxes">
            {[
              "Heart Disease", "Diabetes", "Cancer", "Mental Health Disorders",
              "Neurological Disorders", "Autoimmune Diseases", "High Blood Pressure",
              "Obesity", "Asthma", "Other"
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
      </section>
    </div>
  );
};

export default MyMedicalHistory;
