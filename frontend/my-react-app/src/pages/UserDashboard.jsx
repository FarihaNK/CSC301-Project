import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./UserDashboard.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    time: "",
  });
  // Update current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  // Format date for event storage and comparison - to use for making appointments on the calendar
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Format the current date and time in AM/PM format - to use for the time shown above the calendar
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch existing appointments from the API
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token"); // Get JWT from localStorage
      if (!token) {
        console.error("No authentication token found");
        return;
      }
  
      const response = await axios.get("http://localhost:5004/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }, // Send token in header
      });
  
      const fetchedEvents = response.data.reduce((acc, event) => {
        const dateKey = event.date; // Assuming the API returns a "date" field
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
      }, {});
  
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
    }
  };
  


  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEventDetails({ title: "", description: "", time: "" });
    setShowModal(true);
  };

  // Save appointment (POST request)
  const saveEvent = async () => {
    if (!eventDetails.title.trim()) {
      alert("Event title is required!");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }
  
    const dateKey = formatDate(selectedDate);
    const newEvent = {
      title: eventDetails.title,
      description: eventDetails.description || "",
      date: dateKey,
      appointmentTime: eventDetails.time,
    };
  
    try {
      await axios.post("http://localhost:5004/api/appointments", newEvent, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });
  
      setEvents((prevEvents) => ({
        ...prevEvents,
        [dateKey]: [...(prevEvents[dateKey] || []), newEvent],
      }));
  
      setShowModal(false);
    } catch (error) {
      console.error("Error creating appointment:", error.response?.data || error.message);
    }
  };
  
  
  

  const tileContent = ({ date }) => {
    const dateKey = formatDate(date);
    return events[dateKey] ? (
      <ul className="event-list">
        {events[dateKey].map((event, index) => (
          <li key={index} className="event-indicator">{event.title}</li>
        ))}
      </ul>
    ) : null;
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
            <li>Medical History</li>
            <li>MedAssistant</li>
            <li>Appointments</li>
            <li onClick={() => navigate("/profile")}>Personal Profile</li> {/* New Button */}
            <li>Settings</li>
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
            <button>Insights</button>
            <button>Reports</button>
            <button className="Medications">Medications</button>
          </div>
        </header>

        {/* Main Section */}
        <section className="main-section" id="top-part">
          <div className="left-panel">
            <div className="widget">
              <h3>Your Documents</h3>
              <div className="placeholder"></div>
              <div className="placeholder"></div>
            </div>
            <div className="widget">
              <h3>Recent Diagnosis</h3>
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
            <div className="calendar-header">
              <h3>{formatDateTime(currentDate)}</h3>
            </div>
            <Calendar
              value={selectedDate}
              onClickDay={handleDateClick}
              tileContent={tileContent}
              className="custom-calendar"
            />
          </div>
        </section>
      </main>

      {/* Event Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{eventDetails.id ? "Edit Event" : "Add Event"}</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={eventDetails.title}
              onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Event Description"
              value={eventDetails.description}
              onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
            />
            <input
              type="time"
              value={eventDetails.time}
              onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })}
            />
            <button onClick={saveEvent}>Add</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard; 