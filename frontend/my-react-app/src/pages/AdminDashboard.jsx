import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // Ensure react-calendar is installed
import "react-calendar/dist/Calendar.css"; // Import calendar's default styles
import "./AdminDashboard.css"; // Import custom CSS
import logo from "../assets/logo.png"; // Import logo from the assets folder

const AdminDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Live date and time
  const [selectedDate, setSelectedDate] = useState(new Date()); // Calendar selected date

  // Update current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format the current date and time in AM/PM format
  const formatDateTime = (date) => {
    const dateOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // AM/PM format
    };

    // Combine formatted date and time
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate}, ${formattedTime}`; // Combine date and time without "at"
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Patients</li>
            <li>Schedule</li>
            <li>MedAssistant</li>
            <li>Personal Profile</li> {/* New Button */}
            <li>Settings</li> {/* Settings Button */}
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        {/* Top Bar */}
        <header className="top-bar">
          <input
            type="text"
            placeholder="Search for anything..."
            className="search-bar"
          />
          <div className="navigation">
            <button>Dashboard</button>
            <button>Forms</button>
            <button className="Doc">Document Upload</button>
            <button>To-Do</button>
          </div>
        </header>

        {/* Main Section */}
        <section className="main-section">
          <div className="left-panel">
            <div className="widget">
              <h3>Patient Documents</h3>
              <div className="placeholder"></div>
              <div className="placeholder"></div>
            </div>
            <div className="widget">
              <h3>Upcoming Appointments</h3>
              <div className="placeholder"></div>
              <div className="placeholder"></div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="calendar-section">
            {/* Current Date and Time Header */}
            <div className="calendar-header">
              <h3>{formatDateTime(currentDate)}</h3>
            </div>
            <Calendar
              value={selectedDate} // Calendar uses selectedDate, not currentDate
              onChange={setSelectedDate} // Updates selectedDate only
              className="custom-calendar"
              tileClassName={({ activeStartDate, view }) =>
                view === "year" || view === "decade" ? "year-tile" : null
              }
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

