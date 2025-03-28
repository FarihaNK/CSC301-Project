import React, { useState } from 'react';
import './Prescription.css';
import logo from "../assets/logo.png";

// BloodTestForm Component
const PrescriptionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    DOB: '',
    gender: '',
    address: '',
    medicationName: '',
    dosage: '',
    duration: '',
    refils: '',
    signature: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

    const handleClear = () => {
        setFormData({
            name: '',
            DOB: '',
            gender: '',
            address: '',
            medicationName: '',
            dosage: '',
            duration: '',
            refils: '',
            signature: ''
        });
      };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="form-container">
      <h2>Prescription</h2>
      <form>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="DOB"
            value={formData.DOB}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <h3>Medication Info</h3>
        <div className="form-group">
          <div>
            <label>Medication Name:</label>
            <input
                type="text"
                name="medicationName"
                value={formData.medicationName}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Dosage:</label>
            <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Duration:</label>
            <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Refils:</label>
            <input
                type="text"
                name="refils"
                value={formData.refils}
                onChange={handleChange}
                required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="signature">Signature:</label>
          <input
            type="text"
            id="signature"
            name="signature"
            value={formData.signature}
            onChange={handleChange}
          />
        </div>
      </form>
        <div className="button-group">
          <button type="submit" onClick={handlePrint} className="submit-button">
            Print
          </button>
          <button type="button" onClick={handleClear} className="clear-button">
            Clear
          </button>
        </div>
    </div>
  );
};

// Dashboard Component
const Prescription = () => {
  return (
    <div className="dashboard">

      {/* Main Content */}
      <main className="content">
        <PrescriptionForm />
      </main>
    </div>
  );
};

export default Prescription;