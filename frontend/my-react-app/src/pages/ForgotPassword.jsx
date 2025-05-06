import { useState } from "react";
import "./ForgotPassword.css";
import logo from "../assets/logo.png"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PasswordReset() {
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!userEmail.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      const response = await axios.post("http://localhost:5003/api/auth/forgot-password", {
        email: userEmail,
      });

      setMessage("Reset link sent! Please check your inbox.");
      setUserEmail("");
    } catch (err) {
      console.error("Reset error:", err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReset = () => {
    navigate("/landingpage"); // or your preferred cancel action
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
            required
          />
          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button onClick={handlePasswordReset} className="reset-button">{isSubmitting ? "Sending..." : "Send Reset Link"}</button>
          <button onClick={() => navigate("/")} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
}
