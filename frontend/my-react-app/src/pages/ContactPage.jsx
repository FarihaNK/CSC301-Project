import React from "react";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <div className="container">
      <header className="mainscreen">
        {/* Visitor Section */}
        <div className="visitor">
          <h2>Are you looking for more information?</h2>
          <h3>Contact us at:</h3>
          <p>Email: medassist.visitor@gmail.com</p>
          <p>Phone: 123-456-7890</p>
        </div>
        
        {/* Admin Section */}
        <div className="admin">
          <h2>Are you looking to implement MedAssist into your practice?</h2>
          <h3>Contact us at:</h3>
          <p>Email: medassist.admin@gmail.com</p>
          <p>Phone: 123-456-7890</p>
        </div>
      </header>

      {/* Footer */}
      <footer>
        <p>&copy; {new Date().getFullYear()} MedAssist. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactPage;