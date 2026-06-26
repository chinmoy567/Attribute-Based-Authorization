import { useState, useEffect } from "react";
import { fetchUsers, login } from "../api/client";

const ROLE_COLORS = {
  admin: "bg-purple-100 text-purple-700 border-purple-300",
  manager: "bg-blue-100 text-blue-700 border-blue-300",
  employee: "bg-green-100 text-green-700 border-green-300",
};

export default function Login({ onLogin }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => setError("Could not reach server."));
  }, []);

  async function handleLogin() {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const data = await login(selected.id);
      if (data.token) {
        onLogin(data.token, data.user);
      } else {
        setError("Login failed.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">ABAC Demo</h1>
          <p className="text-slate-400 mt-1">Attribute-Based Access Control</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Select a user to login as</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
          )}

          <div className="space-y-3 mb-6">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelected(user)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selected?.id === user.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-500">
                      {user.department} &middot; Access Level {user.accessLevel}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border capitalize ${ROLE_COLORS[user.role] ?? ""}`}>
                    {user.role}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selected || loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
