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

    return (
        <div className="profile-page">
            <div className="profile-picture-container">
                <div className="profile-picture">
                    <img src={formData.profilePicture || "default-profile.jpg"} alt="Profile" />
                    {isEditing && <input type="file" accept="image/*" onChange={handleImageUpload} />}
                </div>
            </div>
        <div className="profile-container">
            <div className="profile-info">
                <label>Name: <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} /></label>
                <label>Email: <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} /></label>
                <label>Password: <input type="password" name="password" value={formData.password} onChange={handleChange} disabled={!isEditing} /></label>
                <label>Phone Number: <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} /></label>
                <label>Address: <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} /></label>
                <label>Health Card Number: <input type="text" name="healthCard" value={formData.healthCard} onChange={handleChange} disabled={!isEditing} /></label>
                <label>Birthday: <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} disabled={!isEditing} /></label>
                <button onClick={toggleEdit}>{isEditing ? "Save" : "Edit"}</button>
            </div>
        </div>
        <footer className="profile-footer">
            <p>&copy; 2024 MedAssist. All rights reserved.</p>
        </footer>
    </div>
    );
};

export default UserProfile;
