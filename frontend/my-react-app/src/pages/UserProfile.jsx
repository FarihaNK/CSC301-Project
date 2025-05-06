import React, { useState, useEffect } from "react";
import "./UserProfile.css"; // Using the same CSS for styling consistency
import logo from "../assets/logo.png"; // Import logo from assets
import axios from "axios";
import "./UserProfile.css"; // Import the CSS file we just created

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    healthcard: "",
    birthday: "",
    profilePicture: null,
    doctorId: "",
    isDependant: ""
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5003/api/auth/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "isDependant" ? value === "true" : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.name);
      formDataToSend.append("phoneNumber", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("healthCardNumber", formData.healthcard);
      formDataToSend.append("dob", formData.birthday);
      formDataToSend.append("doctorId", formData.doctorId);
      formDataToSend.append("isDependant", formData.isDependant);

      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to create a profile.");
        return;
      }
      const profileData = {
        fullName: formData.name,
        phoneNumber: formData.phone,
        address: formData.address,
        healthCardNumber: formData.healthcard,
        dob: formData.birthday,
        doctorId: formData.doctorId,
        isDependant: formData.isDependant
      };

      // Send API request
      const response = await axios.post("http://localhost:5002/api/patients", profileData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // console.log("Profile created successfully:", response.data);
      alert("Profile created successfully!");

      // Reset form fields after successful submission
      setFormData({
        name: "",
        phone: "",
        address: "",
        healthcard: "",
        birthday: "",
        profilePicture: null,
        isDependant: "",
      });

    } catch (error) {
      console.error("Error creating profile:", error.response?.data || error.message);
      alert("Failed to create profile. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      {/* <div className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Medical History</li>
            <li>MedAssistant</li>
            <li>Appointments</li>
            <li>Personal Profile</li>
            <li>Family History</li>
            <li>Logout</li>
          </ul>
        </nav>
      </div> */}

      {/* Profile Picture Section */}
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

      <main className="content">
        {/* Title */}
        <div className="profile-header">
          <h1 className="profile-title">Your Profile</h1>
        </div>

        <div className="profile-form-container">
          <div className="profile-form-layout">
            {/* Profile Form */}
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
              <label>
                Select Doctor:
                <select name="doctorId" value={formData.doctorId || ""} onChange={handleChange} required>
                  <option value="">-- Select a Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>{doc.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Dependancy Status
                <select name="isDependant" value={formData.isDependant === true ? "true" : formData.isDependant === false ? "false" : ""}
                  onChange={handleChange} required>
                  <option value="">-- Select Option --</option>
                  <option value="true">You are a dependant</option>
                  <option value="false">You are not a dependant.</option>
                </select>
              </label>
              <button type="submit">Create Profile</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;