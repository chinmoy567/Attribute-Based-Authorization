import express from "express";
import { viewProject, updateProject, getProjects, getUsers } from "../controller/projectController.js";    
import { verifyToken } from "../middleware/authentication.js";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";
import { mockUsers } from "../data/projectData.js";

const router = express.Router();

// Mock login route to get token for a user
router.post("/login", (req, res) => {
  const user = mockUsers.find(u => u.id === req.body.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" });
  res.json({ token, user });
});

// Route to get all users
router.get("/users", getUsers);

// Route to get all projects
router.get("/", verifyToken, getProjects);

// Route to view a project
router.get("/:id", verifyToken, viewProject);
// Route to update a project
router.put("/:id", verifyToken, updateProject);

export default router;