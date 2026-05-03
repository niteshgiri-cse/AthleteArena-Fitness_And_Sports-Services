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

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles"));

  // ❌ invalid or expired token
  if (!isTokenValid(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    return <Navigate to="/auth" replace />;
  }

  // ❌ role check (only if provided)
  if (allowedRoles && !roles?.some(r => allowedRoles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;