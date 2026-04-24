import { projects, mockUsers } from "../data/projectData.js";
import { canViewProject, canUpdateProject } from "../policies/projectPolicy.js";
import { authorize } from "../middleware/authorize.js"; 

const handleResponse = (res, status, message, project = null, reason = null) => {
  res.status(status).json({
    status,
    message,
    project,
    reason
  });
};

export const getProjects = (req, res) => {
  handleResponse(res, 200, "Projects retrieved", projects);
};

export const getUsers = (req, res) => {
  handleResponse(res, 200, "Users retrieved", mockUsers);
};

export const viewProject = (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) return handleResponse(res, 404, "Project not found");

  authorize(canViewProject, project)(req, res, () => {
    handleResponse(res, 200, "Project retrieved successfully", project, req.accessReason);
  });
};

export const updateProject = (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) return handleResponse(res, 404, "Project not found");

  authorize(canUpdateProject, project)(req, res, () => {
    handleResponse(res, 200, "Project updated successfully", project, req.accessReason);
  });
};