const Task = require("../models/ToDoList");

// Fetch Task
exports.getTask = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error("Error Fetching Tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { task } = req.body;

    // Ensure user is authenticated
    // if (!req.user || !req.user.id) {
    //   return res.status(401).json({ message: "Unauthorized: No user ID found" });
    // }
    if (!task) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Creating a new task
    const newTask = await Task.create({
      task,
      userId: req.user.id, // Ensure user ID is assigned from the token
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error Creating Task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { completed } = req.body;
    
    // Find the task
    const task = await Task.findByPk(taskId);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    // Update the task
    task.completed = completed;
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error("Error Updating Task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete Task
// Make sure this function exists in your taskController.js
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Attempting to delete task with ID: ${id}`); // Add logging
    
    const task = await Task.findByPk(id);
    if (!task) {
      console.log(`Task with ID ${id} not found`); // Add logging
      return res.status(404).json({ message: "Task not found" });
    }
    
    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
