import { Navigate, Outlet } from "react-router-dom";

const isTokenValid = (token) => {
  try {
    if (!token) return false;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />; // 🔥 IMPORTANT
};

export default ProtectedRoute;