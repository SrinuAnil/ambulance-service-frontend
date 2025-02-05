import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("jwt_token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const token = Cookies.get("admin_jwt_token");
  if (!token) {
    return <Navigate to="/admin" />;
  }
  return children;
};

export const CustomerProtectedRoute = ({ children }) => {
  const token = Cookies.get("customerjwtToken");
  if (!token) {
    return <Navigate to="/customer" />;
  }
  return children;
};
