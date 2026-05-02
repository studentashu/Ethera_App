const express = require("express");
const Project = require("../models/Project");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Create Project (Admin only)
// routes/project.js
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("Access denied");
  }

  const members = req.body.members || [];

  // Ensure creator is included
  if (!members.includes(req.user.id)) {
    members.push(req.user.id);
  }

  const project = await Project.create({
    name: req.body.name,
    members,
    createdBy: req.user.id
  });

  res.json(project);
});
// Get Projects
router.get("/", verifyToken, async (req, res) => {
  const projects = await Project.find({
    members: req.user.id
  }).populate("members");

  res.json(projects);
});

// Update Project
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json("Project not found");
    }

    // Only admin can update
    if (req.user.role !== "admin") {
      return res.status(403).json("Access denied");
    }

    project.name = req.body.name || project.name;
    project.members = req.body.members || project.members;

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json("Error updating project");
  }
});
// Delete Project
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json("Project not found");
    }

    if (req.user.role !== "admin") {
      return res.status(403).json("Access denied");
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json("Error deleting project");
  }
});
module.exports = router;