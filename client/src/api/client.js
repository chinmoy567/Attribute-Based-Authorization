const BASE = "/api/project";

function authHeaders(token) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function fetchUsers() {
  const res = await fetch(`${BASE}/users`);
  const data = await res.json();
  return data.project; // server reuses "project" field for lists
}

export async function login(userId) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function fetchProjects(token) {
  const res = await fetch(`${BASE}/`, { headers: authHeaders(token) });
  return res.json();
}

export async function fetchProject(token, id) {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders(token) });
  return res.json();
}

export async function updateProject(token, id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
  });
  return res.json();
}
