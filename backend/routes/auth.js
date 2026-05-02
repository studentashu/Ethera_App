const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("_id name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
router.post("/register", async (req, res) => {
  

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json("Request body missing");
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("All fields required");
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role
    });

    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json("Email already exists");
    }
    res.status(500).json(err.message);
  }
});
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).json("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json("Invalid password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
});

module.exports = router;