import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Book,
  PlusCircle,
  Repeat,
  RotateCcw,
  BarChart3,
  Bell,
  Library
} from "lucide-react";
import { isAdmin, isMember } from "../utils/auth";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">📚 LMS</h2>

      <nav>
        {isAdmin() && (
          <NavLink to="/" end>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
        )}

        <NavLink to="/books">
          <Book size={18} /> Books
        </NavLink>

        {isAdmin() && (
          <>
            <li>
              <NavLink to="/add-book" className={({ isActive }) => (isActive ? "active" : "")}>
                <span>⊕ Add Book</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/issue" className={({ isActive }) => (isActive ? "active" : "")}>
                <span>📚 Issue</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/return" className={({ isActive }) => (isActive ? "active" : "")}>
                <span>↩️ Return</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/pending-requests" className={({ isActive }) => (isActive ? "active" : "")}>
                <span>⏳ Pending</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/issue-history" className={({ isActive }) => (isActive ? "active" : "")}>
                <span>📜 Issue History</span>
              </NavLink>
            </li>
          </>
        )}

        {isMember() && (
          <NavLink to="/my-books">
            <Library size={18} /> My Books
          </NavLink>
        )}
      </nav>
    </div>
  );
}