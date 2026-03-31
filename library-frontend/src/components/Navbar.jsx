import { LogOut } from "lucide-react";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="navbar glass">
      <h3>🚀 Library Dashboard</h3>

      <button onClick={logout} className="logout">
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}