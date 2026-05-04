const express = require("express");
const Task = require("../models/Task");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.post("/", verifyToken, async (req, res) => {
  const { title, assignedTo, project, dueDate } = req.body;

  if (!title || !assignedTo || !project) {
    return res.status(400).json("Missing fields");
  }

  const proj = await require("../models/Project").findById(project);

  if (!proj) return res.status(404).json("Project not found");

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
router.get("/", verifyToken, async (req, res) => {
  let tasks;

  if (req.user.role === "admin") {
    tasks = await Task.find().populate("assignedTo project");
  } else {
    tasks = await Task.find({
      assignedTo: req.user.id
    }).populate("project");
  }

  res.json(tasks);
});
router.put("/:id", verifyToken, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json("Task not found");

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