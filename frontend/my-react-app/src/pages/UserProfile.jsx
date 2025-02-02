import { useState } from "react";
import "./UserProfile.css"; // Importing styles

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        resetPassword: "",
        phone: "",
        address: "",
        healthCard: "",
        birthday: "",
        profilePicture: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setFormData({ ...formData, profilePicture: imageURL });
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleAddUserProfile = () => {
        alert("Add New User Profile button clicked!"); 
        // Replace this with navigation or functionality
    };

    const handleAllProfiles = () => {
        alert("All Profiles button clicked!");
        // Replace this with navigation or functionality
    };

    return (
        <>
            <div className="header-container">
                <header className="profile-header">
                    <h1>User Profiles</h1>
                </header>
            </div>
        <div className="profile-page">
            <div className="profile-picture-container">
                <div className="profile-picture">
                    <img src={formData.profilePicture || "default-profile.jpg"} alt="Profile" />
                    {isEditing && <input type="file" accept="image/*" onChange={handleImageUpload} />}
                </div>

                {/* New Buttons Below Profile Picture */}
                <div className="profile-buttons">
                    <button onClick={handleAddUserProfile} className="action-button">New User Profile</button>
                    <button onClick={handleAllProfiles} className="action-button">All Profiles</button>
                </div>
            </div>
            
            <div className="profile-container">
                <div className="profile-info">
                    <label>Name: <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} /></label>
                    <label>Phone Number: <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} /></label>
                    <label>Address: <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} /></label>
                    <label>Health Card Number: <input type="text" name="healthCard" value={formData.healthCard} onChange={handleChange} disabled={!isEditing} /></label>
                    <label>Birthday: <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} disabled={!isEditing} /></label>
                    <button onClick={toggleEdit}>{isEditing ? "Save" : "Edit"}</button>
                </div>
            </div>
        </div> 
    </>
    );
};

export default UserProfile;
