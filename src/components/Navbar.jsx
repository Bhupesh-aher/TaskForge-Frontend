import NotificationBell from "./NotificationBell";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b">
      <Link to="/dashboard" className="font-bold text-xl">TaskForge</Link>
      <div className="flex items-center gap-4">
        <NotificationBell />

         <Link
              to="/notifications"
              className="text-sm text-gray-700 hover:underline"
            >
              All Notifications
        </Link>

        <button
          onClick={() => dispatch(logout())}
          className="px-3 py-1 border rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
