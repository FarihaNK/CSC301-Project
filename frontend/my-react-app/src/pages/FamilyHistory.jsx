import React, { useState, useEffect } from "react";
import "./FamilyHistory.css";
import axios from "axios";

const FamilyHistoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    selectedPatientId: "",
    familyMembers: [],
  });
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
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

    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedFamilyMembers = [...prev.familyMembers];
        updatedFamilyMembers[index].conditions = checked
          ? [...updatedFamilyMembers[index].conditions, value]
          : updatedFamilyMembers[index].conditions.filter((c) => c !== value);
        return { ...prev, familyMembers: updatedFamilyMembers };
      });
    } else {
      setFormData((prev) => {
        const updatedFamilyMembers = [...prev.familyMembers];
        if (index !== undefined) {
          updatedFamilyMembers[index][name] = value;
          return { ...prev, familyMembers: updatedFamilyMembers };
        } else {
          return { ...prev, [name]: value };
        }
      });
    }
  };

  const handleAddFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        { relation: "", conditions: [] },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5002/api/family-history`,
        {
          patientId: formData.selectedPatientId,
          familyMembers: formData.familyMembers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Submitted:", res.data);
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
    } catch (err) {
      console.error("Error submitting family history:", err);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close the modal when the user clicks "Close"
  };

  return (
    <div className="form-container">
      <h2>Family History Form</h2>
      <form onSubmit={handleSubmit}>
        <h3>Patient Information</h3>
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange(e)}
          required
        />

        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={(e) => handleChange(e)}
          required
        />

        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={(e) => handleChange(e)}
          required
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

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

        <h3>Family Members</h3>
        {formData.familyMembers.map((member, index) => (
          <div key={index} className="family-member-section">
            <h4 className="family-member-header">Family Member {index + 1}</h4>
            <div className="family-member-details">
              <label>Relation</label>
              <select
                name="relation"
                value={member.relation}
                onChange={(e) => handleChange(e, index)}
              >
                <option value="">Select</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="sibling">Sibling</option>
                <option value="grandparent">Grandparent</option>
                <option value="aunt_uncle">Aunt/Uncle</option>
                <option value="child">Child</option>
                <option value="other">Other</option>
              </select>

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
                  "Other"
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
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={handleAddFamilyMember}>
          Add Family Member
        </button>

        <button type="submit">Save</button>
      </form>

      {/* Modal for Success Message */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Saved successfully!</h3>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyHistoryForm;
