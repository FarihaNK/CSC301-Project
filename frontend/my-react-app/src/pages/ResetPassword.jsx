import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5003/api/auth/reset-password/${token}`,
        { newPassword }
      );
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/userlogin"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error resetting password. Try again."
      );
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">Set New Password</h2>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="reset-input"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="reset-input"
        />
        <button onClick={handleReset} className="reset-button">Reset Password</button>
      </div>
    </div>
  );
};

export default ResetPassword;
