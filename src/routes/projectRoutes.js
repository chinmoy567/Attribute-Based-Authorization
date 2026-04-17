
import express from "express";
import { viewProject, updateProject } from "../controller/projectController.js";    
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

// Route to view a project
router.get("/:id", verifyToken, viewProject);
// Route to update a project
router.put("/:id", verifyToken, updateProject);

export default router;