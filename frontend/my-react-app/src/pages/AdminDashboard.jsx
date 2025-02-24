import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AdminDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    time: "",
    id: null,
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

  

  // Handle date click to view or add event
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEventDetails({ title: "", description: "", time: "", id: null });
    setShowModal(true);
  };

  // Handle editing an existing event
  const handleEditEvent = (event) => {
    setEventDetails(event);
    setShowModal(true);
  };

  // Save event (Add or Edit)
  const saveEvent = () => {
    if (eventDetails.title.trim() === "") {
      alert("Event title is required!");
      return;
    }

    const dateKey = formatDate(selectedDate);
    const newEvent = { ...eventDetails, id: eventDetails.id || Date.now() };

    setEvents((prevEvents) => {
      const eventsForDate = prevEvents[dateKey] || [];

      if (eventDetails.id) {
        // Edit existing event
        const updatedEvents = eventsForDate.map((event) =>
          event.id === eventDetails.id ? newEvent : event
        );
        return { ...prevEvents, [dateKey]: updatedEvents };
      } else {
        // Add new event
        return {
          ...prevEvents,
          [dateKey]: [...eventsForDate, newEvent],
        };
      }
    });

    setShowModal(false);
  };

  // Delete event
  const deleteEvent = (id) => {
    const dateKey = formatDate(selectedDate);
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents[dateKey].filter(
        (event) => event.id !== id
      );
      return { ...prevEvents, [dateKey]: updatedEvents };
    });
    setShowModal(false);
  };

  // Custom tile content to show event indicators
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateKey = formatDate(date);
      const eventsForDate = events[dateKey] || [];
      if (eventsForDate.length > 0) {
        return (
          <ul className="event-list">
            {eventsForDate.map((event) => (
              <li
                key={event.id}
                className="event-indicator"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent calendar's default behavior
                  handleEditEvent(event); // Open the modal with the selected event
                }}
              >
                {""}
              </li>
            ))}
          </ul>
        );
      }
    }
    return null;
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
            {/* <button>Dashboard</button> */}
            {/* <button>Forms</button> */}
            <Link to="/dashboard">
              <button>Dashboard</button>
            </Link>
            <Link to="/forms">
              <button>Forms</button>
            </Link>

            <button className="Doc">Document Upload</button>
            <button>To-Do</button>
          </div>
        </header>

        {/* Main Section */}
        <section className="main-section" id="top-part">
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
              onChange={(e) =>
                setEventDetails({ ...eventDetails, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Event Description"
              value={eventDetails.description}
              onChange={(e) =>
                setEventDetails({
                  ...eventDetails,
                  description: e.target.value,
                })
              }
            />
            <input
              type="time"
              value={eventDetails.time}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, time: e.target.value })
              }
            />
            <button onClick={saveEvent}>
              {eventDetails.id ? "Update" : "Add"}
            </button>
            {eventDetails.id && (
              <button
                onClick={() => deleteEvent(eventDetails.id)}
                className="delete-button"
              >
                Delete
              </button>
            )}
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 