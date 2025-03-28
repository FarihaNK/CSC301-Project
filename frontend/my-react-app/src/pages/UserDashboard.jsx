// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import "./UserDashboard.css";
// import logo from "../assets/logo.png";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const UserDashboard = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [events, setEvents] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [eventDetails, setEventDetails] = useState({
//     title: "",
//     description: "",
//     time: "",
//   });
//   // Update current date and time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDate(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Format date for event storage and comparison
//   const formatDate = (date) => {
//     return date.toISOString().split("T")[0];
//   };

//   // Format the date for the schedule title
//   const formatScheduleTitleDate = (date) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return date.toLocaleDateString(undefined, options);
// };

//   // Format the current date and time in AM/PM format
//   const formatDateTime = (date) => {
//     const dateOptions = {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     };
//     const timeOptions = {
//       hour: "numeric",
//       minute: "numeric",
//       second: "numeric",
//       hour12: true, // AM/PM format
//     };

//     const formattedDate = date.toLocaleDateString("en-US", dateOptions);
//     const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

//     return `${formattedDate}, ${formattedTime}`;
//   };
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // Fetch existing appointments from the API
//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem("token"); // Get JWT from localStorage
//       if (!token) {
//         console.error("No authentication token found");
//         return;
//       }
  
//       const response = await axios.get("http://localhost:5004/api/appointments", {
//         headers: { Authorization: `Bearer ${token}` }, // Send token in header
//       });
  
//       const fetchedEvents = response.data.reduce((acc, event) => {
//         const dateKey = event.date; // Assuming the API returns a "date" field
//         if (!acc[dateKey]) acc[dateKey] = [];
//         acc[dateKey].push(event);
//         return acc;
//       }, {});
  
//       setEvents(fetchedEvents);
//     } catch (error) {
//       console.error("Error fetching appointments:", error.response?.data || error.message);
//     }
//   };

//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//     setEventDetails({ title: "", description: "", time: "" });
//     setShowModal(true);
//   };

//   // Save appointment (POST request)
//   const saveEvent = async () => {
//     if (!eventDetails.title.trim()) {
//       alert("Event title is required!");
//       return;
//     }
  
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("No authentication token found");
//       return;
//     }
  
//     const dateKey = formatDate(selectedDate);
//     const newEvent = {
//       title: eventDetails.title,
//       description: eventDetails.description || "",
//       date: dateKey,
//       appointmentTime: eventDetails.time,
//     };
  
//     try {
//       await axios.post("http://localhost:5004/api/appointments", newEvent, {
//         headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
//       });
  
//       setEvents((prevEvents) => ({
//         ...prevEvents,
//         [dateKey]: [...(prevEvents[dateKey] || []), newEvent],
//       }));
  
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error creating appointment:", error.response?.data || error.message);
//     }
//   };
  
  
  

//   const tileContent = ({ date }) => {
//     const dateKey = formatDate(date);
//     return events[dateKey] ? (
//       <ul className="event-list">
//         {events[dateKey].map((event, index) => (
//           <li key={index} className="event-indicator">{event.title}</li>
//         ))}
//       </ul>
//     ) : null;
//   };


//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       {/* <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li>Medical History</li>
//             <li>MedAssistant</li>
//             <li>Appointments</li>
//             <li onClick={() => navigate("/profile")}>Personal Profile</li> 
//             <li onClick={() => navigate("/familyhistory")}>Family History</li> 
//             <li>Logout</li>
//           </ul>
//         </nav>
//       </aside> */}

//       {/* Main Content */}
//       <main className="content">
//         {/* Top Bar */}
//         {/* <header className="top-bar">
//           <input
//             type="text"
//             placeholder="Search for anything..."
//             className="search-bar"
//           />
//           <div className="navigation">
//             <button>Dashboard</button>
//             <button>Insights</button>
//             <button>Reports</button>
//             <button className="Medications">Medications</button>
//           </div>
//         </header> */}

//         {/* Main Section */}
//         <section className="main-section" id="top-part">
//           <div className="left-panel">
//             <div className="widget">
//               <h3>Your Documents</h3>
//               <div className="placeholder"></div>
//               <div className="placeholder"></div>
//             </div>
//             <div className="widget">
//               <h3>Recent Diagnosis</h3>
//               <div className="placeholder"></div>
//             </div>
//             <div className="widget">
//               <h3>Upcoming Appointments</h3>
//               <div className="placeholder"></div>
//               <div className="placeholder"></div>
//             </div>
//           </div>

//           {/* Calendar Section */}
//           <div className="calendar-section">
//             <div className="calendar-header">
//               <h3>{formatDateTime(currentDate)}</h3>
//             </div>
//             <Calendar
//               value={selectedDate}
//               onClickDay={handleDateClick}
//               tileContent={tileContent}
//               className="custom-calendar"
//             />
//             {/* Schedule Section */}
//             <div className="schedule-section">
//                 <h3>{formatDate(selectedDate) === formatDate(new Date()) ? "Today's Schedule" : `${formatScheduleTitleDate(selectedDate)} Schedule`}</h3>
//                 <ul className="schedule-list">
//                     {(events[formatDate(selectedDate)] || []).map((event) => (
//                         <li key={event.id} className="schedule-item">
//                             <strong>{event.title}</strong>: {event.time}
//                             <p>{event.description}</p> {/* Add this line for the description */}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Event Modal */}
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h3>{eventDetails.id ? "Edit Event" : "Add Event"}</h3>
//             <input
//               type="text"
//               placeholder="Event Title"
//               value={eventDetails.title}
//               onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Event Description"
//               value={eventDetails.description}
//               onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
//             />
//             <input
//               type="time"
//               value={eventDetails.time}
//               onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })}
//             />
//             <button onClick={saveEvent}>Add</button>
//             <button onClick={() => setShowModal(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard; 

// export default AdminDashboard; 
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

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

  const [funFact, setFunFact] = useState(""); // State to store the fun fact
  const [healthTip, setHealthTip] = useState(""); // State to store the health tip
  const [patientTip, setPatientTip] = useState(""); // State to store the doctor tip

  // Fun facts array
  const funFacts = [
    "Did you know? The human body has 206 bones!",
    "Your skin is the largest organ in your body.",
    "The average person has about 100,000 hairs on their scalp.",
    "Heart disease is the leading cause of death worldwide.",
    "Did you know? Your body has more than 600 muscles!",
    "The human brain contains around 86 billion neurons.",
  ];

  // Health tips array
  const healthTips = [
    "Drink at least 8 glasses of water a day to stay hydrated.",
    "Exercise regularly to improve heart health and boost energy.",
    "Get at least 7-9 hours of sleep each night for optimal health.",
    "Eat a balanced diet rich in fruits, vegetables, and lean proteins.",
    "Practice good hygiene by washing your hands frequently.",
    "Manage stress with relaxation techniques such as meditation or yoga.",
  ];

  // Doctor tips array
  const patientTips = [
    "Regular physical activity can help reduce stress, improve mood, and keep your body strong.",
    "A healthy diet can strengthen your immune system, improve energy levels, and help prevent chronic conditions.",
    "Staying hydrated is essential for your body’s functions, including digestion, circulation, and temperature regulation.",
    "Aim for 7-9 hours of sleep each night to help your body repair itself and boost your mental well-being.",
    "Practice relaxation techniques such as meditation, deep breathing, or yoga to reduce stress levels.",
    "Regular doctor visits are important for monitoring your health, catching potential issues early, and ensuring your wellness.",
  ];

  // Function to get a random fun fact
  const getRandomFunFact = () => {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setFunFact(randomFact);
  };

  // Function to get a random health tip
  const getRandomHealthTip = () => {
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    setHealthTip(randomTip);
  };

  // Function to get a random doctor tip
  const getRandomPatientTip = () => {
    const randomTip = patientTips[Math.floor(Math.random() * patientTips.length)];
    setPatientTip(randomTip);
  };

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

  // Format the date for the schedule title
  const formatScheduleTitleDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
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
    getRandomFunFact(); // Set a random fun fact when the component mounts
    getRandomHealthTip(); // Set a random health tip when the component mounts
    getRandomPatientTip(); // Set a random patient tip when the component mounts
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

  const handleEditEvent = (event) => {
    setEventDetails({...event, id: event.id, time: event.appointmentTime});
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
      description: eventDetails.description,
      id: eventDetails.id || "",
      date: dateKey,
      appointmentTime: eventDetails.time,
    };

  //   try {
  //     await axios.post("http://localhost:5004/api/appointments", newEvent, {
  //       headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  //     });
  //     setEvents((prevEvents) => ({
  //       ...prevEvents,
  //       [dateKey]: [...(prevEvents[dateKey] || []), newEvent],
  //     }));

  //     if (eventDetails.id) {
  //       const updatedEvents = eventForDate.map((event) => 
  //         event.id === eventDetails.id ? newEvent : event
  //     );
  //     return {... prevEvents, [dateKey]: updatedEvents };
  //     } else {
  //       return {
  //         ...prevEvents, 
  //         [dateKey]: [...eventsForDate, newEvent]
  //       }; 
  
  //     }

  //   } catch (error) {
  //     console.error("Error creating appointment:", error.response?.data || error.message);
  //   }
  //   setShowModal(false);
  // };
  try {
    if (eventDetails.id) {
      // Log the full update details for debugging
      console.log("Updating event with ID:", eventDetails.id);
      console.log("Update payload:", newEvent);
      console.log("update date:", eventDetails.appointmentTime)

      // Ensure the full URL is correct and the ID is passed correctly
      const updateResponse = await axios.put(
        `http://localhost:5004/api/appointments/${eventDetails.id}`, 
        newEvent, 
        {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json" 
          },
        }
      );

      console.log("Update response:", updateResponse.data);

      // Update state with new event data
      setEvents((prevEvents) => {
        const updatedEvents = (prevEvents[dateKey] || []).map((event) =>
          event.id === eventDetails.id ? newEvent : event
        );
        return { ...prevEvents, [dateKey]: updatedEvents };
      });
    } else {
      // Create a new event via API
      await axios.post("http://localhost:5004/api/appointments", newEvent, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      // Add new event to state
      setEvents((prevEvents) => ({
        ...prevEvents,
        [dateKey]: [...(prevEvents[dateKey] || []), newEvent],
      }));
    }
  } catch (error) {
    console.error("Error saving appointment:", error.response?.data || error.message);
    // Log more detailed error information
    if (error.response) {
      console.error("Error details:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
  }

  setShowModal(false);
};

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

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateKey = formatDate(date);
      const eventsForDate = events[dateKey] || [];
      if (eventsForDate.length > 0) {
        return <div className="event-indicator"></div>; // Just a visual marker
       }
     }
     return null;
 };

  return (
    <div className="dashboard">
      {/* Main Content */}
      <main className="content">
        <section className="main-section" id="top-part">
          <div className="left-panel">
            <div className="welcomeMessage">
              <h2>Welcome, [FULL NAME]!</h2>
              <p>Your dashboard is all set for the day. Stay informed, track your progress, and connect with your healthcare team all in one place. We’re here to make managing your health easier.</p>
            </div>
            <div className="widget">
              <h3>Medical Fun Fact</h3>
              <p>{funFact}</p> {/* Display the random fun fact here */}
            </div>
            <div className="widget">
              <h3>Health Tip</h3>
              <p>{healthTip}</p> {/* Display the random health tip here */}
            </div>
            <div className="widget">
              <h3>Patient Tip</h3>
              <p>{patientTip}</p> {/* Display the random doctor tip here */}
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
            <div className="schedule-section">
              <h3>
                {formatDate(selectedDate) === formatDate(new Date()) 
                  ? "Today's Schedule" 
                  : `${formatScheduleTitleDate(selectedDate)} Schedule`}
              </h3>
              <ul className="schedule-list">
                {(events[formatDate(selectedDate)] || []).map((event) => (
                  <li 
                    key={event.id} 
                    className="schedule-item" 
                    onClick={() => handleEditEvent(event)}
                  >
                    <div className="event-container">
                      <span className="event-title">{event.title}</span>
                      <span className="event-description">{event.description}</span>
                      <span className="event-time">({event.appointmentTime})</span> 
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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

export default UserDashboard;
