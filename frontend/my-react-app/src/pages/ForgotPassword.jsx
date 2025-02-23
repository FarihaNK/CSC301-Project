import { useState } from "react";
import "./ForgotPassword.css";
import logo from "../assets/logo.png"; 

export default function PasswordReset() {
  const [userEmail, setUserEmail] = useState("");

  const handlePasswordReset = () => {
    console.log("Sending reset email to:", userEmail);
    // Add password reset logic here
  };

  const handleCancelReset = () => {
    console.log("Cancel reset process");
    // Add cancel logic (e.g., navigate to login page)
  };

  return (
    <div className="reset-container">
      <div className="info-bar">
        <button className="info-button">About</button>
        <button className="info-button">Contact</button>
      </div>
      <div className="reset-content"> 
        <img src={logo} className="reset-logo" alt="MedAssist Logo" />
        <h2 className="reset-name">MedAssist</h2>
        <div className="reset-card">
          <h2 className="reset-title">Reset Password</h2>
          <p className="reset-description">
            If you have forgotten your password, we are here to assist you. 
            Please enter your email address below, and we will send you a link 
            to securely reset your password.
          </p>
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="reset-input"
          />
          <button onClick={handlePasswordReset} className="reset-button">Send Reset Link</button>
          <button onClick={handleCancelReset} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
}
