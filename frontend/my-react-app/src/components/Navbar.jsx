import React from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {
    return <nav className="navbar">
        <div className="logo-container">
            <img src={logo} alt="MedAssist Logo" className="logo" />
            <h1 className="app-name">MedAssist</h1>
        </div>
        <ul className="nav">
            <CustomLink href="/">Home</CustomLink>
            <CustomLink href="/about">About</CustomLink>
            {/* need to change when we actually create the contact page */}
            <CustomLink href="/contactpage">Contact</CustomLink> 
            <CustomLink href="/adminlogin">Admin Login</CustomLink> 
            <CustomLink href="/userlogin">Patient Login</CustomLink> 
            {/* <button className="nav-button" onClick={() => (window.location.href = "/userlogin")}>
                User Login
            </button> */}
            
        </ul>
  </nav>
}

function CustomLink({href, children, ...props}){
    const path = window.location.pathname
    return(
        <li className={path === href ? "active" : ""}>
            <a href={href}{...props}>{children}</a>
        </li>
    )
}