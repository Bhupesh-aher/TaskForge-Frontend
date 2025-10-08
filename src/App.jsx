import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BoardDetails from "./pages/BoardDetails";
import Navbar from "./components/Navbar";
import { useSelector, useDispatch  } from "react-redux";
import { useEffect } from "react";
import { socket } from "./socket";
import { addNotification, fetchNotifications } from "./features/notifications/notificationSlice";


function App() {
   const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth); // you store user in auth slice

    // 1) When user logs in (user object appears), join their personal room and fetch notifications
    useEffect(() => {
      if (user && user._id) {
        socket.emit("joinUser", user._id);
        dispatch(fetchNotifications());
      }
    }, [user, dispatch]);

    // 2) Listen for incoming notifications and push to redux
    useEffect(() => {
      const handler = (notification) => {
        dispatch(addNotification(notification));
      };
      socket.on("notification", handler);

      return () => {
        socket.off("notification", handler);
      };
    }, [dispatch]);
  return (
    <BrowserRouter>
       {/* show navbar only when logged in (optional) */}
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
         <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
         <Route path="/board/:id" element={token ? <BoardDetails /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
