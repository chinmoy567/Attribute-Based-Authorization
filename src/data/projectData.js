export const projects = [
  {
    id: 1,
    name: "HR Project",
    department: "HR",
    accessLevel: 1,
    team: [1, 2],
  },
  {
    id: 2,
    name: "IT Project",
    department: "IT",
    accessLevel: 2,
    team: [3, 4],
  },
];

export const mockUsers = [
  { id: 1, name: "Alice Admin", role: "admin", department: "Management", accessLevel: 5 },
  { id: 2, name: "Bob HR", role: "manager", department: "HR", accessLevel: 2 },
  { id: 3, name: "Charlie IT", role: "employee", department: "IT", accessLevel: 2 },
  { id: 4, name: "Diana Sales", role: "employee", department: "Sales", accessLevel: 1 },
];