import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // NavLink khud pata lagata hai ki abhi kaunsa page khula hai
  const linkClass = ({ isActive }) =>
    `px-2 py-1 rounded ${isActive ? "bg-teal-100 text-teal-800 font-semibold" : "text-slate-600"}`;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold text-teal-700">PhysioTrack</span>

        <div className="flex items-center gap-2 text-sm">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/logs" className={linkClass}>Logs</NavLink>
          <span className="hidden sm:inline text-slate-500 ml-2">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1 rounded border text-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}