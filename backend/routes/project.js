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

module.exports = router;