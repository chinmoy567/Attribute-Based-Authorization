export const canViewProject = (user, project) => {
  if (user.role === "admin") {
    return { permitted: true, reason: "Admin role grants global view access." };
  }
  if (user.department === project.department) {
    return { permitted: true, reason: `Department match (${user.department}) grants view access.` };
  }
  if (user.accessLevel >= project.accessLevel && project.team.includes(user.id)) {
    return { permitted: true, reason: `User access level (${user.accessLevel}) and team membership grant view access.` };
  }
  
  return { permitted: false, reason: "User does not have required role, department match, or team access level." };
};

export const canUpdateProject = (user, project) => {
  // Environmental Attribute Mock: Check if action is performed during business hours (9 AM - 5 PM)
  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 9 && currentHour < 17;

  if (user.role === "admin") {
    return { permitted: true, reason: "Admin role grants global update access." };
  }

  // Example of using Environmental Context in ABAC
  if (!isBusinessHours) {
    return { permitted: false, reason: "Updates are only allowed during business hours (9 AM - 5 PM)." };
  }

  if (user.role === "manager" && user.department === project.department) {
    return { permitted: true, reason: `Manager role in matching department (${user.department}) grants update access.` };
  }
  
  if (project.team.includes(user.id)) {
    return { permitted: true, reason: "Team membership grants update access during business hours." };
  }

  return { permitted: false, reason: "User lacks required role or team membership for updating." };
};