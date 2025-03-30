import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ToDoListPatient.css";


const ToDoListPatient = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
        },
      });
      setTasks(response.data);
    } catch (error) {
      
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        // console.log(newTask);
        const response = await axios.post(
          "http://localhost:5005/api/tasks",
          { task: newTask },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
            },
          }
        );
        setTasks([...tasks, response.data]); // Update task list with the new task
        setNewTask(""); // Clear the input field
      } catch (error) {
        console.error("Error adding task:", error);
        setError("Failed to add task.");
      }
    }
  };

  const toggleTask = async (index) => {
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
    try {
      const response = await axios.put(
        `http://localhost:5005/api/tasks/${tasks[index].id}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedTasks = tasks.map((task, i) =>
        i === index ? response.data : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error toggling task:", error);
      setError("Failed to toggle task.");
    }
  };

  const deleteTask = async (index) => {
    try {
      await axios.delete(`http://localhost:5005/api/tasks/${tasks[index].id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task.");
    }
  };

  return (
    <div className="dashboard">
      <main className="content">
        <section className="main-section">
          {/* <div className="left-panel"> */}
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
              {error && <p>{error}</p>}
              <ul className="task-list">
                {tasks.map((task, index) => (
                  <li key={task.id} className={task.completed ? "completed" : ""}>
                    <div className="checkbox">
                    <input
                    
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(index)}
                    />
                     </div>
                    <span className="task">{task.task}</span>
                    <button className="deleteButton" onClick={() => deleteTask(index)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          {/* </div> */}
        </section>
      </main>
    </div>
  );
};

export default ToDoListPatient;
