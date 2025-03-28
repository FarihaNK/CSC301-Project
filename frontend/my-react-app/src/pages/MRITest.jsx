import React, { useState } from 'react';
import './MRITest.css';
import logo from "../assets/logo.png";

// BloodTestForm Component
const MRITestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    DOB: '',
    gender: '',
    address: '',
    reasonForMRI: '',
    areaToBeScanned: '',
    typeOfMRI: '',
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
            reasonForMRI: '',
            areaToBeScanned: '',
            typeOfMRI: '',
            signature: ''
        });
      };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="form-container">
      <h2>MRI Form</h2>
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
        <h3>MRI Info</h3>
        <div className="form-group">
          <div>
            <label>Reason For MRI:</label>
            <input
                type="text"
                name="reasonForMRI"
                value={formData.reasonForMRI}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Area to be Scanned:</label>
            <input
                type="text"
                name="areaToBeScanned"
                value={formData.areaToBeScanned}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Type of MRI:</label>
            <input
                type="text"
                name="typeOfMRI"
                value={formData.typeOfMRI}
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
const MRITest = () => {
  return (
    <div className="dashboard">
      {/* Main Content */}
      <main className="content">
        {/* MRI Test Form */}
        <MRITestForm />
      </main>
    </div>
  );
};

export default MRITest;