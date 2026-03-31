import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
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