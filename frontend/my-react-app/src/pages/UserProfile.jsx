import React, { useState } from "react";
import "./UserDashboard.css"; // Using the same CSS for styling consistency
import logo from "../assets/logo.png"; // Import logo from assets

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    healthcard: "",
    birthday: "",
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Medical History</li>
            <li>CogniLink</li>
            <li>Appointments</li>
            <li>Add Patient Profile</li>
            <li>Settings</li>
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
            <button>Insights</button>
            <button>Reports</button>
            <button className="Medications">Medications</button>
          </div>
        </header>

        {/* Profile Form */}
        <section className="profile-form-container">
          <h2>Create User Profile</h2>
          <div className="profile-form-layout">
            {/* Profile Picture Upload */}
            <div className="profile-picture-section">
              <div className="profile-picture-circle">
                {formData.profilePicture ? (
                  <img
                    src={URL.createObjectURL(formData.profilePicture)}
                    alt="Profile Preview"
                  />
                ) : (
                  <span>Upload</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="profile-picture-input"
              />
            </div>

            {/* User Information Form */}
            <form onSubmit={handleSubmit} className="profile-form">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Healthcard Number:
                <input
                  type="text"
                  name="healthcard"
                  value={formData.healthcard}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Birthday:
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">Create Profile</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
