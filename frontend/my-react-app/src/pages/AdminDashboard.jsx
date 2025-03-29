// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import axios from "axios";
// import "./AdminDashboard.css";
// import logo from "../assets/logo.png";
// import { Link, useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [events, setEvents] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [eventDetails, setEventDetails] = useState({
//     title: "",
//     description: "",
//     time: "",
//   });
// // Update current date and time every second
// useEffect(() => {
//   const timer = setInterval(() => {
//     setCurrentDate(new Date());
//   }, 1000);
//   return () => clearInterval(timer);
// }, []);

// // Format date for event storage and comparison - to use for making appointments on the calendar
// const formatDate = (date) => {
//   return date.toISOString().split("T")[0];
// };

// // Format the current date and time in AM/PM format - to use for the time shown above the calendar
// const formatDateTime = (date) => {
//   const dateOptions = {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   };
//   const timeOptions = {
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//     hour12: true, // AM/PM format
//   };

//   // Combine formatted date and time
//   const formattedDate = date.toLocaleDateString("en-US", dateOptions);
//   const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

//   return `${formattedDate}, ${formattedTime}`; // Combine date and time without "at"
// };
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
//             <li onClick={() => navigate("/patientlist")}>Patients</li>
//             <li>Schedule</li>
//             <li onClick={() => navigate("/medassist")}>MedAssistant</li>
//             <li onClick={() => navigate("/todo")}>TODO</li>
//             <li>Settings</li> 
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
//             <Link to="/dashboard">
//               <button>Dashboard</button>
//             </Link>
//             <Link to="/forms">
//               <button>Forms</button>
//             </Link>

//             <button className="Doc">Document Upload</button>
//             <button>To-Do</button>
//           </div>
//         </header> */}

//         {/* Main Section */}
//         <section className="main-section" id="top-part">
//           <div className="left-panel">
//             <div className="welcomeMessage">
//               <h2>Welcome, Dr. [Last Name]!</h2> 
//               <p>Your dashboard is all set for the day. With patient updates, appointments, and key information just a click away, everything’s in place for another productive day of care. Let’s take it one step at a time.</p>
//             </div>
//             {/* <div className="widget"> */}
//               {/* BACKEND NEEDED HERE */}
//               {/* <div className="welcomeMessage"> */}
//                 {/* <h3>Welcome, Dr. [Last Name]!</h3> 
//                 <p>Your dashboard is all set for the day. With patient updates, appointments, and key information just a click away, everything’s in place for another productive day of care. Let’s take it one step at a time.</p>
//                  */}
//               {/* </div> */}
//             {/* </div> */}
//             <div className="widget">
//               <h3>To-do List</h3>
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

// export default AdminDashboard; 
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

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

  const [funFact, setFunFact] = useState(""); // State to store the fun fact
  const [healthTip, setHealthTip] = useState(""); // State to store the health tip
  const [doctorTip, setDoctorTip] = useState(""); // State to store the doctor tip

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
  const doctorTips = [
    "Always listen carefully to your patients; it helps build trust.",
    "Take regular breaks during long shifts to avoid burnout.",
    "Maintain good hand hygiene to prevent the spread of infections.",
    "Stay up-to-date with the latest medical research and guidelines.",
    "Document everything thoroughly – it’s crucial for patient care.",
    "Be compassionate and empathetic; your patients rely on you for support.",
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
  const getRandomDoctorTip = () => {
    const randomTip = doctorTips[Math.floor(Math.random() * doctorTips.length)];
    setDoctorTip(randomTip);
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
    getRandomDoctorTip(); // Set a random doctor tip when the component mounts
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
    setEventDetails({ ...event, id: event.id, time: event.appointmentTime});
    // console.log(event);
    setShowModal(true);
  };
  
  // const saveEvent = async () => {
  //   if (!eventDetails.title.trim()) {
  //     alert("Event title is required!");
  //     return;
  //   }
  
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     console.error("No authentication token found");
  //     return;
  //   }
  //   console.log(eventDetails)
  
  //   const dateKey = formatDate(selectedDate);
  //   const newEvent = {
  //     title: eventDetails.title,
  //     description: eventDetails.description,
  //     id: eventDetails.id || Date.now().toString(), // Generate ID if new event
  //     date: dateKey,
  //     appointmentTime: eventDetails.time,
  //   };
  
  //   try {
  //     if (eventDetails.id) {
  //       // Log the full update details for debugging
  //       console.log("Updating event with ID:", eventDetails.id);
  //       console.log("Update payload:", newEvent);
  //       console.log("update date:", eventDetails.appointmentTime)
  
  //       // Ensure the full URL is correct and the ID is passed correctly
  //       const updateResponse = await axios.put(
  //         `http://localhost:5004/api/appointments/${eventDetails.id}`, 
  //         newEvent, 
  //         {
  //           headers: { 
  //             Authorization: `Bearer ${token}`, 
  //             "Content-Type": "application/json" 
  //           },
  //         }
  //       );
  
  //       console.log("Update response:", updateResponse.data);
  
  //       // Update state with new event data
  //       setEvents((prevEvents) => {
  //         const updatedEvents = (prevEvents[dateKey] || []).map((event) =>
  //           event.id === eventDetails.id ? newEvent : event
  //         );
  //         return { ...prevEvents, [dateKey]: updatedEvents };
  //       });
  //     } else {
  //       // Create a new event via API
  //       await axios.post("http://localhost:5004/api/appointments", newEvent, {
  //         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  //       });
  
  //       // Add new event to state
  //       setEvents((prevEvents) => ({
  //         ...prevEvents,
  //         [dateKey]: [...(prevEvents[dateKey] || []), newEvent],
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error saving appointment:", error.response?.data || error.message);
  //     // Log more detailed error information
  //     if (error.response) {
  //       console.error("Error details:", {
  //         status: error.response.status,
  //         data: error.response.data,
  //         headers: error.response.headers
  //       });
  //     }
  //   }
  
  //   setShowModal(false);
  // };
  
  // const saveEvent = async () => {
  //   if (!eventDetails.title.trim()) {
  //     alert("Event title is required!");
  //     return;
  //   }
  
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     console.error("No authentication token found");
  //     return;
  //   }
  
  //   const dateKey = formatDate(selectedDate);
  //   const newEvent = {
  //     title: eventDetails.title,
  //     description: eventDetails.description,
  //     id: eventDetails.id || Date.now().toString(), // Generate ID if new event
  //     date: dateKey,
  //     appointmentTime: eventDetails.time,
  //   };
  
  //   try {
  //     if (eventDetails.id) {
  //       // Update existing event via API
  //       await axios.put(`http://localhost:5004/api/appointments/${eventDetails.id}`, newEvent, {
  //         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  //       });
  
  //       // Update state with new event data
  //       setEvents((prevEvents) => {
  //         const updatedEvents = (prevEvents[dateKey] || []).map((event) =>
  //           event.id === eventDetails.id ? newEvent : event
  //         );
  //         return { ...prevEvents, [dateKey]: updatedEvents };
  //       });
  //     } else {
  //       // Create a new event via API
  //       await axios.post("http://localhost:5004/api/appointments", newEvent, {
  //         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  //       });
  
  //       // Add new event to state
  //       setEvents((prevEvents) => ({
  //         ...prevEvents,
  //         [dateKey]: [...(prevEvents[dateKey] || []), newEvent],
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error saving appointment:", error.response?.data || error.message);
  //   }
  
  //   setShowModal(false);
  // };
  
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
      // Include the ID if it exists
      id: eventDetails.id
    };
  
    try {
      if (eventDetails.id) {
        // Log the full update details for debugging
        console.log("Updating event with full payload:", newEvent);
  
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
          const updatedEvents = { ...prevEvents };
          const dateEvents = updatedEvents[dateKey] || [];
          
          updatedEvents[dateKey] = dateEvents.map((event) =>
            event.id === eventDetails.id ? { ...event, ...newEvent } : event
          );
          
          return updatedEvents;
        });
      } else {
        // Create new event
        const createResponse = await axios.post(
          "http://localhost:5004/api/appointments", 
          newEvent, 
          {
            headers: { 
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json" 
            },
          }
        );
  
        // Add new event to state
        setEvents((prevEvents) => ({
          ...prevEvents,
          [dateKey]: [...(prevEvents[dateKey] || []), createResponse.data],
        }));
      }
  
      setShowModal(false);
    } catch (error) {
      console.error("Error saving appointment:", error);
      
      // Detailed error logging
      if (error.response) {
        console.error("Error details:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        alert(`Update failed: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Check your network connection.");
      } else {
        console.error("Error setting up request:", error.message);
        alert("An unexpected error occurred.");
      }
    }
  };

  // const deleteEvent = (id) => {
  //   const dateKey = formatDate(selectedDate);
  //   setEvents((prevEvents) => {
  //     const updatedEvents = prevEvents[dateKey].filter(
  //       (event) => event.id !== id
  //     );
  //     return { ...prevEvents, [dateKey]: updatedEvents };
  //   });
  //   setShowModal(false);
  // };
  const deleteEvent = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5004/api/appointments/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      // Remove from local state
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        
        // Find the date of the deleted event
        const dateKey = Object.keys(updatedEvents).find(date => 
          updatedEvents[date].some(event => event.id === id)
        );
  
        if (dateKey) {
          updatedEvents[dateKey] = updatedEvents[dateKey].filter(
            (event) => event.id !== id
          );
        }
  
        return updatedEvents;
      });
  
      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete the appointment. Please try again.");
    }
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
      {/* Sidebar */}
      {/* <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li onClick={() => navigate("/patientlist")}>Patients</li>
            <li>Schedule</li>
            <li onClick={() => navigate("/medassist")}>MedAssistant</li>
            <li>Settings</li> 
            <li>Logout</li>
          </ul>
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className="content">
        <section className="main-section" id="top-part">
          <div className="left-panel">
            <div className="welcomeMessage">
              <h2>Welcome, Dr. [Last Name]!</h2>
              <p>Your dashboard is all set for the day. With patient updates, appointments, and key information just a click away, everything’s in place for another productive day of care. Let’s take it one step at a time.</p>
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
              <h3>Doctor Tip</h3>
              <p>{doctorTip}</p> {/* Display the random doctor tip here */}
            </div>
          </div>

          <div className="dashboard-container">
            {/* Calendar Section */}
            <div className="calendar-section">
              <div className="calendar-header">
                <h3>{formatDateTime(currentDate)}</h3>
                <Calendar
                  value={selectedDate}
                  onClickDay={handleDateClick}
                  tileContent={tileContent}
                  className="custom-calendar"
                />
              </div>
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