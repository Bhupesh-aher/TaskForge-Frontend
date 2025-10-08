import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchNotifications, markNotificationAsRead } from "../features/notifications/notificationSlice";

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { list, unreadCount, loading } = useSelector((s) => s.notifications);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // initial load handled in App.jsx on login; optional double-check:
    if (!list.length) dispatch(fetchNotifications());
  }, [dispatch]);

  const onClickNotification = async (id) => {
    // optimistic UI: mark locally (optional) then call API
    await dispatch(markNotificationAsRead(id));
    // optionally navigate or open related board
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded-lg max-h-96 overflow-y-auto z-50">
          {loading && <p className="p-3 text-sm text-gray-500">Loading...</p>}
          {!loading && list.length === 0 && <p className="p-3 text-sm text-gray-500">No notifications yet.</p>}
          {list.map((n) => (
            <div
              key={n._id}
              onClick={() => onClickNotification(n._id)}
              className={`p-3 border-b cursor-pointer ${n.isRead ? "bg-white" : "bg-blue-50"}`}
            >
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">From: {n.sender?.name || "System"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
