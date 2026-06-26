import { useState } from "react";
import { fetchProject, updateProject } from "../api/client";

function Badge({ children, color }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
}

export default function ProjectCard({ project, token }) {
  const [viewResult, setViewResult] = useState(null);
  const [updateResult, setUpdateResult] = useState(null);
  const [loadingView, setLoadingView] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  async function handleView() {
    setLoadingView(true);
    const data = await fetchProject(token, project.id);
    setViewResult(data);
    setLoadingView(false);
  }

  async function handleUpdate() {
    setLoadingUpdate(true);
    const data = await updateProject(token, project.id);
    setUpdateResult(data);
    setLoadingUpdate(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg">{project.name}</h3>
            <p className="text-sm text-slate-500">
              {project.department} &middot; Access Level {project.accessLevel}
            </p>
          </div>
          <Badge color="slate">ID #{project.id}</Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {project.team.map((uid) => (
            <span key={uid} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              User {uid}
            </span>
          ))}
          <span className="text-xs text-slate-400 self-center">on team</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleView}
            disabled={loadingView}
            className="flex-1 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm hover:bg-indigo-100 disabled:opacity-50 transition-colors"
          >
            {loadingView ? "Checking…" : "View"}
          </button>
          <button
            onClick={handleUpdate}
            disabled={loadingUpdate}
            className="flex-1 py-2 rounded-lg bg-amber-50 text-amber-700 font-medium text-sm hover:bg-amber-100 disabled:opacity-50 transition-colors"
          >
            {loadingUpdate ? "Checking…" : "Update"}
          </button>
        </div>
      </div>

      {viewResult && (
        <ResultRow
          label="View"
          status={viewResult.status}
          message={viewResult.message}
          reason={viewResult.reason}
          onDismiss={() => setViewResult(null)}
        />
      )}
      {updateResult && (
        <ResultRow
          label="Update"
          status={updateResult.status}
          message={updateResult.message}
          reason={updateResult.reason}
          onDismiss={() => setUpdateResult(null)}
        />
      )}
    </div>
  );
}

function ResultRow({ label, status, message, reason, onDismiss }) {
  const ok = status === 200;
  return (
    <div className={`px-5 py-3 border-t text-sm ${ok ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${ok ? "text-green-700" : "text-red-700"}`}>
            {label}: {ok ? "Allowed" : "Denied"}
          </span>
          <Badge color={ok ? "green" : "red"}>{status}</Badge>
        </div>
        <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
      </div>
      <p className={ok ? "text-green-600" : "text-red-600"}>{reason || message}</p>
    </div>
  );
}
