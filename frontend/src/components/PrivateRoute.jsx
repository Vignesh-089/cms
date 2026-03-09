import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("adminToken");

  if (loading) return null;

  // If token exists but user not yet restored, don't redirect
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;