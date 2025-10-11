import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <nav className="flex justify-between items-center px-5 py-3 bg-white border-b shadow-sm sticky top-0 z-50">
      <Link
        to="/dashboard"
        className="text-2xl font-bold text-indigo-600 tracking-wide"
      >
        TaskForge
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className={`text-sm font-medium ${
            location.pathname === "/dashboard"
              ? "text-indigo-600"
              : "text-gray-600 hover:text-indigo-500"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/notifications"
          className={`text-sm font-medium ${
            location.pathname === "/notifications"
              ? "text-indigo-600"
              : "text-gray-600 hover:text-indigo-500"
          }`}
        >
          Notifications
        </Link>

        <NotificationBell />

        <button
          onClick={() => dispatch(logout())}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
