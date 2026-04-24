import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/project",
});

const fmt = (obj) => JSON.stringify(obj, null, 2);

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [session, setSession] = useState({ token: "", user: null });
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [viewResponse, setViewResponse] = useState(null);
  const [updateResponse, setUpdateResponse] = useState(null);
  const [loading, setLoading] = useState({ users: false, login: false, projects: false, view: false, update: false });
  const [error, setError] = useState("");

  const authHeaders = useMemo(() => {
    if (!session.token) return {};
    return { Authorization: `Bearer ${session.token}` };
  }, [session.token]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading((s) => ({ ...s, users: true }));
      setError("");
      try {
        const res = await api.get("/users");
        setUsers(res.data.project || []);
        if ((res.data.project || []).length > 0) {
          setSelectedUserId(String(res.data.project[0].id));
        }
      } catch (err) {
        setError(readError(err));
      } finally {
        setLoading((s) => ({ ...s, users: false }));
      }
    };

    loadUsers();
  }, []);

  const handleLogin = async () => {
    if (!selectedUserId) return;
    setLoading((s) => ({ ...s, login: true }));
    setError("");
    setProjects([]);
    setViewResponse(null);
    setUpdateResponse(null);

    try {
      const res = await api.post("/login", { userId: Number(selectedUserId) });
      setSession({ token: res.data.token, user: res.data.user });
    } catch (err) {
      setError(readError(err));
    } finally {
      setLoading((s) => ({ ...s, login: false }));
    }
  };

  const handleLoadProjects = async () => {
    setLoading((s) => ({ ...s, projects: true }));
    setError("");
    try {
      const res = await api.get("/", { headers: authHeaders });
      const list = res.data.project || [];
      setProjects(list);
      if (list.length > 0) {
        setSelectedProjectId(String(list[0].id));
      }
    } catch (err) {
      setError(readError(err));
    } finally {
      setLoading((s) => ({ ...s, projects: false }));
    }
  };

  const handleViewProject = async () => {
    if (!selectedProjectId) return;
    setLoading((s) => ({ ...s, view: true }));
    setError("");
    try {
      const res = await api.get(`/${selectedProjectId}`, { headers: authHeaders });
      setViewResponse(res.data);
    } catch (err) {
      setViewResponse(err.response?.data || null);
      setError(readError(err));
    } finally {
      setLoading((s) => ({ ...s, view: false }));
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProjectId) return;
    setLoading((s) => ({ ...s, update: true }));
    setError("");
    try {
      const res = await api.put(`/${selectedProjectId}`, {}, { headers: authHeaders });
      setUpdateResponse(res.data);
    } catch (err) {
      setUpdateResponse(err.response?.data || null);
      setError(readError(err));
    } finally {
      setLoading((s) => ({ ...s, update: false }));
    }
  };

  const clearSession = () => {
    setSession({ token: "", user: null });
    setProjects([]);
    setSelectedProjectId("");
    setViewResponse(null);
    setUpdateResponse(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 font-display">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="grid-overlay" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="animate-floatIn rounded-3xl border border-slate-900/10 bg-white/80 p-6 shadow-panel backdrop-blur md:p-8">
          <p className="text-xs uppercase tracking-[0.26em] text-teal-700">Learning Sandbox</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Attribute Based Authorization Playground
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-700 sm:text-base">
            Login as different users, then try project view and update actions to observe ABAC policy outcomes.
            Update permissions also depend on business hours from your backend policy.
          </p>
        </header>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        ) : null}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <Panel title="1) Login" delay="80ms">
              <label className="block text-sm font-medium text-slate-700">Choose mock user</label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-teal-600 transition focus:ring"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={loading.users || loading.login}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} | {u.role} | {u.department} | level {u.accessLevel}
                  </option>
                ))}
              </select>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button className="btn-primary" onClick={handleLogin} disabled={!selectedUserId || loading.login}>
                  {loading.login ? "Logging in..." : "Get Token"}
                </button>
                <button className="btn-ghost" onClick={clearSession}>Reset Session</button>
              </div>

              <pre className="code-card mt-4">{session.user ? fmt(session.user) : "No active session"}</pre>
            </Panel>

            <Panel title="2) Load Projects" delay="160ms">
              <button className="btn-primary" onClick={handleLoadProjects} disabled={!session.token || loading.projects}>
                {loading.projects ? "Loading..." : "Fetch Projects"}
              </button>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Choose project</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-teal-600 transition focus:ring"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={!projects.length}
                >
                  {!projects.length ? <option value="">No projects loaded</option> : null}
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.id} {p.name} | dept: {p.department} | level: {p.accessLevel}
                    </option>
                  ))}
                </select>
              </div>

              <pre className="code-card mt-4">{projects.length ? fmt(projects) : "Projects not loaded yet"}</pre>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="3) Try View Permission" delay="240ms">
              <button className="btn-primary" onClick={handleViewProject} disabled={!session.token || !selectedProjectId || loading.view}>
                {loading.view ? "Checking..." : "GET /api/project/:id"}
              </button>
              <pre className="code-card mt-4">{viewResponse ? fmt(viewResponse) : "Run view check to see response"}</pre>
            </Panel>

            <Panel title="4) Try Update Permission" delay="320ms">
              <button className="btn-primary" onClick={handleUpdateProject} disabled={!session.token || !selectedProjectId || loading.update}>
                {loading.update ? "Checking..." : "PUT /api/project/:id"}
              </button>
              <p className="mt-3 text-xs text-slate-600">
                Your backend allows updates during 9 AM - 5 PM, except admin users.
              </p>
              <pre className="code-card mt-3">{updateResponse ? fmt(updateResponse) : "Run update check to see response"}</pre>
            </Panel>
          </div>
        </section>
      </main>
    </div>
  );
}

function readError(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.message) return err.message;
  return "Unexpected error";
}

function Panel({ title, delay, children }) {
  return (
    <section
      className="animate-floatIn rounded-3xl border border-slate-900/10 bg-white/80 p-5 shadow-panel backdrop-blur"
      style={{ animationDelay: delay }}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
