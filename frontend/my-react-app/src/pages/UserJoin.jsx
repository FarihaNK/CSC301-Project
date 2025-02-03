import { useState } from "react";
import "./UserJoin.css";
import logo from "../assets/logo.png"; // Ensure the correct path

export default function UserLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, confirmPassword] = useState("");

  const handleLogin = () => {
    console.log("Signing Up woth:", {name, email, password, passwordConfirm});
    // Add authentication logic here
  };

  return (
    <div className="login-container">
      <div className="info_bar">
        <button className="info_button">About</button>
        <button className="info_button">Contact</button>
      </div>
      <div className="login-content"> {/* New wrapper to stack logo & card */}
        <img src={logo} className="login-logo" alt="Login Logo" />
        <h2 className="login-name">MedAssist</h2>
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
            placeholder="Retype Password to Confrim"
            value={passwordConfirm}
            onChange={(e) => confirmPassword(e.target.value)}
            className="login-input"
          />
          <button onClick={handleLogin} className="login-button">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
