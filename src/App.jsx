import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BoardDetails from "./pages/BoardDetails";
import { useSelector } from "react-redux";

function App() {
  const { token } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
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
