import React, { useState } from "react";
import "./ToDoList.css";
import logo from "../assets/logo.png";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Medical History</li>
            <li>MedAssistant</li>
            <li>Appointments</li>
            <li>Add Patient Profile</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <header className="top-bar">
          <input type="text" placeholder="Search for anything..." className="search-bar" />
          <div className="navigation">
            <button>Dashboard</button>
            <button>Insights</button>
            <button>Reports</button>
            <button className="Medications">Medications</button>
          </div>
        </header>

        <section className="main-section">
          <div className="left-panel">
            <div className="widget">
              <h3>To-Do List</h3>
              <div className="task-input">
                <input
                  type="text"
                  placeholder="Add a new task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={addTask}>Add</button>
              </div>
              <ul className="task-list">
                {tasks.map((task, index) => (
                  <li key={index} className={task.completed ? "completed" : ""}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(index)}
                    />
                    <span>{task.text}</span>
                    <button onClick={() => deleteTask(index)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ToDoList;
