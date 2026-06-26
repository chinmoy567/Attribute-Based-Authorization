import { useState, useEffect } from "react";
import { fetchProjects } from "../api/client";
import ProjectCard from "./ProjectCard";

const ROLE_COLORS = {
  admin: "bg-purple-500",
  manager: "bg-blue-500",
  employee: "bg-green-500",
};

export default function Dashboard({ token, user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects(token)
      .then((data) => {
        if (data.project) setProjects(data.project);
        else setError("Failed to load projects.");
      })
      .catch(() => setError("Server error."));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${ROLE_COLORS[user.role] ?? "bg-slate-500"}`}>
              {user.name[0]}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">
                {user.role} &middot; {user.department} &middot; Access Level {user.accessLevel}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
          <p className="text-slate-500 text-sm mt-1">
            Click <span className="font-medium text-indigo-600">View</span> or{" "}
            <span className="font-medium text-amber-600">Update</span> to test your ABAC permissions.
          </p>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-sm text-indigo-700">
          <strong>Policy summary:</strong> Admins can view &amp; update anything. Managers/employees can view same-department projects or team projects. Updates restricted to business hours (9 AM–5 PM) for non-admins.
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} token={token} />
          ))}
        </div>
      </main>
    </div>
  );
}
