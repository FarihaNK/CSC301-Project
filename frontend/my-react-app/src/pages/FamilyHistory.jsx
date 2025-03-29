import React, { useState, useEffect } from "react";
import "./FamilyHistory.css";
import axios from "axios";

const FamilyHistoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    selectedPatientId: "",
    familyMembers: [{ relation: "", conditions: [], otherCondition: "" }],
  });

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5002/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch patients", err);
        setPatients([]);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updatedFamilyMembers = [...prev.familyMembers];

      if (type === "checkbox" && name === "conditions") {
        const updatedConditions = checked
          ? [...updatedFamilyMembers[index].conditions, value]
          : updatedFamilyMembers[index].conditions.filter((c) => c !== value);

        updatedFamilyMembers[index].conditions = updatedConditions;
      } else if (name === "otherCondition") {
        updatedFamilyMembers[index].otherCondition = value;
      } else if (index !== undefined) {
        updatedFamilyMembers[index][name] = value;
      } else {
        return { ...prev, [name]: value };
      }

      return { ...prev, familyMembers: updatedFamilyMembers };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Merge otherCondition into conditions array if it exists
      const finalFamilyMembers = formData.familyMembers.map((member) => {
        const mergedConditions = member.otherCondition
          ? [...member.conditions, member.otherCondition]
          : member.conditions;
        return { ...member, conditions: mergedConditions };
      });

      const res = await axios.post(
        `http://localhost:5002/api/medicalhistory`,
        {
          patientId: formData.selectedPatientId,
          familyMembers: finalFamilyMembers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Submitted:", res.data);
      alert("Saved successfully!");
    } catch (err) {
      console.error("Error submitting family history:", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Personal Hisory</h2>
      <form onSubmit={handleSubmit}>
        <label>Select Patient</label>
        <select
          name="selectedPatientId"
          value={formData.selectedPatientId}
          onChange={(e) =>
            setFormData({ ...formData, selectedPatientId: e.target.value })
          }
          required
        >
          <option value="">-- Select a Patient --</option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.fullName}
            </option>
          ))}
        </select>

        <h3>Personal History</h3>
        {formData.familyMembers.map((member, index) => (
          <div key={index} className="family-member-section">
            <div className="family-member-details">
              <h5>Health Conditions</h5>
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
                      name="conditions"
                      value={condition}
                      checked={member.conditions.includes(condition)}
                      onChange={(e) => handleChange(e, index)}
                    />
                    {condition}
                  </label>
                ))}

                {/* Show textbox if "Other" is checked */}
                {member.conditions.includes("Other") && (
                  <div className="other-condition-input">
                    <label>Please specify:</label>
                    <input
                      type="text"
                      name="otherCondition"
                      value={member.otherCondition || ""}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default FamilyHistoryForm;
