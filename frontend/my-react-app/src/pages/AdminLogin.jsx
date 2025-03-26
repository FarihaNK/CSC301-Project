import { useState } from "react";
import "./AdminLogin.css";
import logo from "../assets/logo.png"; // Ensure the correct path
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Logging in with:", { email, password });
    // Add authentication logic here
    try {
      const response = await axios.post("http://localhost:5003/api/auth/login", {
        email,
        password,
      }, { headers: { "Content-Type": "application/json" } });
  
      const {user, token } = response.data;
  
      // Store token in local storage (or session storage)
      localStorage.setItem("token", token);
  
      console.log("Login successful!", user.role);
      alert("Login successful! as", user.role);
      navigate("/admindashboard");
      
      // Redirect or update UI after login
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid credentials. Please try again.");
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
          <h2 className="login-title">Admin Login</h2>
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
          <button className="forgetPassport_button">Forgot Password?</button>
          <button onClick={handleLogin} className="login-button">Login</button>
          <button className="patientLogin_button"> Are you a Patient? <br /> Click Here to Login </button>

        </div>
      </div>
    </div>
  );
}
