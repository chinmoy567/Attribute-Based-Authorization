import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [auth, setAuth] = useState(null);

  function handleLogin(token, user) {
    setAuth({ token, user });
  }

  function handleLogout() {
    setAuth(null);
  }

  if (!auth) return <Login onLogin={handleLogin} />;

  return <Dashboard token={auth.token} user={auth.user} onLogout={handleLogout} />;
}
