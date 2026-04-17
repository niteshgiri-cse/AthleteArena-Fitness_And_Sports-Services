import { Navigate } from "react-router-dom";

const isTokenValid = (token) => {
  try {
    if (!token || token === "undefined" || token === "null") {
      return false;
    }

    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (isTokenValid(token)) {
    return <Navigate to="/userProfile" replace />;
  }

  return children;
};

export default PublicRoute;