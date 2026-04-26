import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBell,
  FiUser,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
  FiUpload, // 👈 change this
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: <FiHome /> },
  { name: "Notification", path: "/admin/notification", icon: <FiBell /> },
  { name: "Register Events", path: "/admin/register-event", icon: <FiUser /> },
  { name: "Manage Users", path: "/admin/bookings", icon: <FiCalendar /> },
  { name: "Reports", path: "/admin/reports", icon: <FiBarChart2 /> },
  { name: "Upload Course", path: "/admin/upload-course", icon: <FiUpload /> }, 
];

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("adminImage");
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800">

      {/* 🔹 PROFILE */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-800">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="admin"
          className="w-11 h-11 rounded-full border-2 border-indigo-500"
        />
        <div>
          <h2 className="text-white text-sm font-semibold">Amit Admin</h2>
          <p className="text-xs text-slate-400">Administrator</p>
        </div>
      </div>

      {/* 🔹 MENU */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* 🔹 LOGOUT */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium transition"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
}