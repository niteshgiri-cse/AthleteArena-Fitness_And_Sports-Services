  import { Navigate, Outlet } from "react-router-dom";

  const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/auth" replace />;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const roles = decoded.roles || [];

      console.log("JWT ROLES:", roles); // debug

      const isAllowed = roles.some((role) =>
        allowedRoles.includes(role)
      );

      if (!isAllowed) {
        console.log("BLOCKED ❌");
        return <Navigate to="/" replace />;
      }

      console.log("ALLOWED ✅");

      // 🔥 IMPORTANT FIX
      return children ? children : <Outlet />;
    } catch (err) {
      console.error("TOKEN ERROR:", err);
      return <Navigate to="/auth" replace />;
    }
  };

  export default ProtectedRoute;