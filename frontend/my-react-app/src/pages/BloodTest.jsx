import React, { useState } from 'react';
import './BloodTest.css';
import logo from "../assets/logo.png";

// BloodTestForm Component
const BloodTestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    DOB: '',
    gender: '',
    address: '',
    cholesterol: false,
    glucose: false,
    hemoglobin: false,
    thyroid: false,
    cbc: false,
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
          cholesterol: false,
          glucose: false,
          hemoglobin: false,
          thyroid: false,
          cbc: false,
          signature: ''
        });
      };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="form-container">
      <h2>Blood Test Form</h2>
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
        <div className="form-group">
          <label>Tests Requested:</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="cholesterol"
                checked={formData.cholesterol}
                onChange={handleChange}
              />
              Cholesterol
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="glucose"
                checked={formData.glucose}
                onChange={handleChange}
              />
              Glucose
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="hemoglobin"
                checked={formData.hemoglobin}
                onChange={handleChange}
              />
              Hemoglobin
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="thyroid"
                checked={formData.thyroid}
                onChange={handleChange}
              />
              Thyroid
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="cbc"
                checked={formData.cbc}
                onChange={handleChange}
              />
              Complete Blood Count
            </label>
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
      {/* <button type="clear" onClick={handleClear} className="clear-button">
            Clear
      </button>
      <button type="button" onClick={handlePrint}>
        Print Form
      </button> */}
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
const BloodTest = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Patients</li>
            <li>Schedule</li>
            <li>MedAssistant</li>
            <li>Personal Profile</li> {/* New Button */}
            <li>Settings</li> {/* Settings Button */}
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        {/* Top Bar */}
        <header className="top-bar">
          <input
            type="text"
            placeholder="Search for anything..."
            className="search-bar"
          />
          <div className="navigation">
            <button>Dashboard</button>
            <button>Forms</button>
            <button className="Doc">Document Upload</button>
            <button>To-Do</button>
          </div>
        </header>

        {/* Blood Test Form */}
        <BloodTestForm />
      </main>
    </div>
  );
};

export default BloodTest;