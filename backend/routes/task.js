const express = require("express");
const Task = require("../models/Task");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Create Task
// routes/task.js
router.post("/", verifyToken, async (req, res) => {
  const { title, assignedTo, project, dueDate } = req.body;

  if (!title || !assignedTo || !project) {
    return res.status(400).json("Missing fields");
  }

  // Check project exists
  const proj = await require("../models/Project").findById(project);

  if (!proj) return res.status(404).json("Project not found");

  // Only project members can be assigned
  if (!proj.members.includes(assignedTo)) {
    return res.status(400).json("User not in project");
  }

  const task = await Task.create({
    title,
    assignedTo,
    project,
    dueDate,
    status: "todo"
  });

  res.json(task);
});
// Get My Tasks
router.get("/", verifyToken, async (req, res) => {
  let tasks;

  if (req.user.role === "admin") {
    // Admin sees all tasks
    tasks = await Task.find().populate("assignedTo project");
  } else {
    // Member sees only assigned tasks
    tasks = await Task.find({
      assignedTo: req.user.id
    }).populate("project");
  }

  res.json(tasks);
});

// Update Task Status
router.put("/:id", verifyToken, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json("Task not found");

  // Allow admin OR assigned user
  if (
    req.user.role !== "admin" &&
    task.assignedTo.toString() !== req.user.id
  ) {
    return res.status(403).json("Not allowed");
  }

  task.title = req.body.title || task.title;
  task.status = req.body.status || task.status;
  task.dueDate = req.body.dueDate || task.dueDate;

  await task.save();

  res.json(task);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json("Task not found");

  if (req.user.role !== "admin") {
    return res.status(403).json("Only admin can delete");
  }

  await task.deleteOne();

  res.json({ message: "Task deleted" });
});
module.exports = router;