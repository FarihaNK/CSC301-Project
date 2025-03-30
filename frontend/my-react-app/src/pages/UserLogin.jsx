
import { useState } from "react";
import "./Userlogin.css";
import logo from "../assets/logo.png"; // Ensure the correct path
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async() => {
    // console.log("Logging in with:", { email, password });
    // Add authentication logic here
    try {
        const response = await axios.post("http://localhost:5003/api/auth/login", {
          email,
          password,
        }, { headers: { "Content-Type": "application/json" } });
    
        const { user, token } = response.data;
    
        // Store token in local storage (or session storage)
        localStorage.setItem("token", token);
    
        // console.log("Login successful!", user);
        alert("Login successful!");
        navigate("/userdashboard");
        
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
          <h2 className="login-title">Patient Login</h2>
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
          <button className="forgetPassport_button" onClick={() => navigate("/forgetpassword")}>Forgot Password?</button>
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
          <button className="adminLogin_button" onClick={() => navigate("/adminlogin")}> Are you an Admin? <br /> Click Here to Login </button>
        </div>
      </div>
    </div>
  );
}