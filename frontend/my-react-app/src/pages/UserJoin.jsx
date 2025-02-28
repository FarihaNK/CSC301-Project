import { useState } from "react";
import "./UserJoin.css";
import logo from "../assets/logo.png"; // Ensure the correct path
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function UserJoin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, confirmPassword] = useState("");
  const role = "patient"
  const navigate = useNavigate();

  const handleSignup = async() => {
    if (password !== passwordConfirm) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Signing up with:", { name, email, password });
    try {
      const response = await axios.post("http://localhost:5003/api/auth/register", {
        name,  // Added name
        email,
        password,
        role,
      }, { headers: { "Content-Type": "application/json" } });

      console.log("Signup successful!");
      alert("Signup successful!");
      navigate("/");

    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content"> {/* New wrapper to stack logo & card */}
        <div className="title-and-logo">
          <img src={logo} className="login-logo" alt="Login Logo" />
          <h2 className="login-name">MedAssist</h2>
        </div>
        <div className="login-card">
          <h2 className="login-title">Patient Sign Up</h2>
          <input
            type="full"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Retype Password to Confirm"
            value={passwordConfirm}
            onChange={(e) => confirmPassword(e.target.value)}
            className="login-input"
          />
          <button onClick={handleSignup} className="login-button">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}