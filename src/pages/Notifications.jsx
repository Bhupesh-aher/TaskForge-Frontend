import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationAsRead } from "../features/notifications/notificationSlice";

export default function Notifications() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    list.forEach((n) => {
      if (!n.isRead) dispatch(markNotificationAsRead(n._id));
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={handleMarkAllRead}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
        >
          Mark all as read
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && list.length === 0 && <p>No notifications yet.</p>}

      <ul className="divide-y divide-gray-200">
        {list.map((n) => (
          <li
            key={n._id}
            className={`p-4 ${n.isRead ? "bg-white" : "bg-blue-50"}`}
          >
            <p className="text-sm">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              From: {n.sender?.name || "System"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
